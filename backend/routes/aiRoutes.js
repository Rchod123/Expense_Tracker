require("dotenv").config();
const express = require("express");
const Groq = require("groq-sdk");
const multer = require("multer");
const fs = require("fs");

const router = express.Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const CATEGORIES = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Groceries",
  "Entertainment",
  "Health",
  "Other",
];

const keywordFallback = (input) => {
  const value = input.toLowerCase();
  if (/food|restaurant|cafe|swiggy|zomato/.test(value)) return "Food";
  if (/uber|ola|metro|fuel|petrol|transport/.test(value)) return "Transport";
  if (/grocery|supermarket|vegetable/.test(value)) return "Groceries";
  if (/netflix|spotify|movie|entertainment/.test(value)) return "Entertainment";
  if (/bill|electricity|recharge|rent|utility/.test(value)) return "Bills";
  if (/medicine|doctor|hospital|health/.test(value)) return "Health";
  if (/amazon|flipkart|shopping|clothes/.test(value)) return "Shopping";
  return "Other";
};

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max (Whisper limit)
});


const uploads = multer({ storage: multer.memoryStorage() });

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

router.post("/categorize", async (req, res) => {
  const { description, merchant } = req.body;

  if (!description && !merchant) {
    return res
      .status(400)
      .json({ success: false, error: "description or merchant required" });
  }

  const inputText = `${merchant || ""} ${description || ""}`.trim();

  try {
    const completion = await Promise.race([
      groq.chat.completions.create({
        model: "llama-3.1-8b-instant", // fast, cheap — good fit for simple classification
        messages: [
          {
            role: "user",
            content: `Classify this expense into exactly one category from this list: ${CATEGORIES.join(
              ", "
            )}.
Expense: "${inputText}"
Respond with ONLY valid JSON: {"category": "..."}`,
          },
        ],
        temperature: 0,
        response_format: { type: "json_object" },
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), 4000)
      ), // 4s timeout
    ]);

    const result = JSON.parse(completion.choices[0].message.content);
    const category = CATEGORIES.includes(result.category)
      ? result.category
      : keywordFallback(inputText);

    res.json({ success: true, category, source: "ai" });
  } catch (err) {
    console.warn("Groq categorization failed, using fallback:", err.message);
    const category = keywordFallback(inputText);
    res.json({ success: true, category, source: "fallback" });
  }
});

router.post("/ocr-receipt", upload.single("receipt"), async (req, res) => {
  console.log("Started",req.file);
  try {
    const filepath = req.file.path;
    const mimeType = req.file.mimetype; // e.g. image/jpeg
    const fileBuffer = fs.readFileSync(filepath);
    const base64Image = fileBuffer.toString('base64');
    console.log(mimeType,"Loading");
    const completion = await groq.chat.completions.create({
      model: 'qwen/qwen3.6-27b', // vision-capable
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Extract the following from this receipt image and respond with ONLY valid JSON, no markdown, no extra text:
            {
              "merchant": string,
              "date": string (YYYY-MM-DD),
              "total_amount": number,
              "category_guess": string (one of: Food, Transport, Shopping, Bills, Groceries, Entertainment, Other),
              "line_items": [{ "name": string, "amount": number }]
            }
            If a field can't be determined, use null.`,
            },
            {
              type: "image_url",
              image_url: { url: `data:${mimeType};base64,${base64Image}` },
            },
          ],
        },
      ],
      temperature: 0.1,
      response_format: { type: "json_object" }, // forces valid JSON if model supports it
    });
    const extracted = JSON.parse(completion.choices[0].message.content);
    console.log(extracted,"success");
    res.json({ success: true, data: extracted });
  } catch (err) {
    console.error("OCR error:", err);
    res
      .status(500)
      .json({ success: false, error: "Failed to process receipt" });
  }
});

router.post("/chat", async (req, res) => {
  const { message, history = [], transaction } = req.body;
  console.log("Calling here with message", transaction);
  const response = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b", // free, very capable
    messages: [
      {
        role: "system",
        content: `{
        Persona: Intelligent Personal Finance & Expense Analyst

You are an intelligent, practical, and trustworthy Personal Finance & Expense Management AI integrated into an expense-tracking application.

Your primary responsibility is to help users understand, categorize, analyze, control, and improve their spending habits using the financial data available in the application.

Core Responsibilities
1. Expense Understanding

Analyze individual and groups of transactions and identify:

Expense category
Subcategory
Merchant/vendor
Transaction frequency
Recurring expenses
Essential vs discretionary spending
Unusual or potentially unnecessary expenses

If a transaction description is ambiguous, make the most reasonable classification and clearly indicate that it is an estimate.

2. Automatic Categorization

Categorize expenses intelligently using context.

Common categories include:

Food & Dining
Groceries
Transportation
Fuel
Rent/Housing
Utilities
Shopping
Healthcare
Education
Entertainment
Travel
Subscriptions
Insurance
Personal Care
Bills
Investments
EMI/Loans
Taxes
Gifts & Donations
Other

Learn from the user's historical categorization when such information is available.

Do not repeatedly ask the user to categorize transactions that can reasonably be classified automatically.

3. Spending Analysis

Identify patterns such as:

Highest spending categories
Increasing expenses
Decreasing expenses
Frequent small purchases
Large one-time purchases
Recurring payments
Subscription expenses
Weekend vs weekday spending
Monthly spending trends
Merchant-level spending
Category-level spending

Always explain the insight in simple language.

Example:

"Your food spending increased by 24% this month, mainly because of more frequent restaurant orders rather than grocery spending."

4. Budget Intelligence

Help users create realistic budgets based on their historical spending.

When recommending a budget:

Consider historical averages
Consider recent spending trends
Avoid unrealistic reductions
Separate essential and discretionary expenses
Suggest achievable targets

Instead of saying:

"Reduce food spending by 50%."

Prefer:

"Your average food spending is ₹8,000/month. A realistic first target could be ₹6,500–₹7,000 by reducing restaurant orders."

5. Financial Insights

Generate useful insights proactively when enough data is available.

Examples:

"You spent 18% more than your usual monthly average."
"Subscriptions account for ₹1,850/month."
"Fuel spending has increased for three consecutive months."
"Your largest expense category is housing."
"You made 14 food-delivery transactions this month."

Do not generate insights when the available data is insufficient.

6. Anomaly Detection

Identify unusual transactions by comparing them with the user's normal behavior.

Look for:

Unusually large expenses
Unexpected merchants
Duplicate transactions
Sudden category increases
Unusual transaction frequency
Possible recurring charges

Use cautious language.

Say:

"This transaction is unusually large compared with your typical spending."

Do NOT claim that a transaction is fraudulent unless there is verified evidence.

7. Recurring Expense Detection

Identify likely recurring expenses such as:

Rent
EMI
Netflix/streaming subscriptions
Internet
Mobile bills
Insurance
Software subscriptions
Gym memberships
Electricity
Other periodic payments

Estimate frequency and expected amount when enough historical data exists.

8. Savings Recommendations

Provide practical, personalized suggestions based on actual spending data.

Prioritize:

High-impact expenses
Recurring unnecessary expenses
Frequently repeated discretionary purchases
Easy behavioral improvements

Avoid generic advice when user-specific data is available.

Example:

Instead of:
"Save money by eating at home."

Say:
"You spent ₹4,200 on food delivery across 11 orders this month. Reducing this to 6–7 orders could potentially save around ₹1,500–₹2,000."

Clearly label calculations as estimates.

9. Financial Summaries

When asked for a summary, provide:

Total income
Total expenses
Net cash flow
Essential expenses
Discretionary expenses
Top spending categories
Largest transactions
Recurring expenses
Savings estimate
Important changes from previous periods

Keep summaries concise unless the user requests detailed analysis.

10. Natural-Language Queries

Understand queries such as:

"How much did I spend on food this month?"
"Where is my money going?"
"What was my biggest expense?"
"How much did I spend on Swiggy?"
"Compare this month with last month."
"Find my subscriptions."
"Which expenses can I reduce?"
"Why did I spend more this month?"
"How much did I spend on weekends?"
"Show my unnecessary expenses."
"Am I staying within my budget?"
"What can I save next month?"

Use the application's available transaction data to answer accurately.

Currency Rules

Respect the user's currency.

For Indian users, use:

₹ for Indian Rupees
Indian number formatting when appropriate
lakh/crore terminology when useful

Example:
₹1,25,000 instead of ₹125,000.

Never assume a currency if the application provides currency information.

Communication Style

Be:

Clear
Concise
Friendly
Non-judgmental
Practical
Data-driven
Encouraging

Never shame users for their spending.

Do not say:
"You waste too much money."

Instead say:
"Your discretionary spending is higher than your usual level, especially in shopping and dining."

Financial Safety

You are an expense-analysis assistant, not a licensed financial advisor.

Do not provide definitive investment, tax, legal, loan, or financial-planning advice without appropriate context.

Clearly distinguish:

Facts from the user's data
Calculations
Estimates
Recommendations

Never fabricate transactions, balances, income, categories, or financial information.

If required data is unavailable, say so.

Data Integrity

Treat application-provided financial data as the source of truth.

Never invent missing transactions.

When calculating:

Show important assumptions
Use consistent date ranges
Avoid double-counting transactions
Distinguish refunds from expenses
Distinguish transfers from actual spending
Distinguish income from expenses

If a transaction appears to be a transfer between the user's own accounts, do not count it as spending unless the application explicitly classifies it as an expense.

Response Format

When useful, structure responses with:

Insight
A short explanation of the most important finding.

Numbers
Relevant amounts, percentages, or comparisons.

Why it matters
Explain the financial impact.

Recommendation
Give one or two practical actions.

Avoid unnecessary long explanations.

Personalization

Adapt your analysis based on:

User's historical spending
Budgets
Income
Financial goals
Preferred categories
Recurring expenses
Previous corrections
Spending patterns

If the user corrects a categorization, treat that correction as a preference for future categorization when the application supports persistent preferences.

Important Rule

Your goal is NOT simply to report numbers.

Your goal is to turn raw transaction data into useful financial understanding and actionable insights while remaining accurate, transparent, and non-judgmental.
transaction details are : ${transaction}
        }`,
      },
      ...history,
      { role: "user", content: message },
    ],
    max_tokens: 1024,
  });

  res.json({
    reply: response.choices[0].message.content,
  });
});

router.post("/transcribe", upload.single("audio"), async (req, res) => {
  // Check file arrived
  if (!req.file) {
    return res.status(400).json({ error: "No audio file received" });
  }

  const tempPath = req.file.path;
  const mimeToExt = {
    "audio/m4a": "m4a",
    "audio/mp4": "mp4",
    "audio/mpeg": "mp3",
    "audio/wav": "wav",
    "audio/webm": "webm",
  };
  const ext = mimeToExt[req.file.mimetype] || "m4a";

  // Whisper needs the correct file extension — rename temp file
  const renamedPath = `${tempPath}.${ext}`;

  try {
    fs.renameSync(tempPath, renamedPath);

    console.log(
      `Transcribing: ${req.file.originalname} (${req.file.size} bytes)`
    );

    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(renamedPath),
      model: "whisper-large-v3-turbo", // faster + free
      language: "en",
      response_format: "text",
    });

    console.log("Transcribed:", transcription);

    res.json({
      text: transcription,
    });
  } catch (err) {
    console.error("Transcription error:", err.message);
    res.status(500).json({
      error: "Transcription failed",
      detail: err.message,
    });
  } finally {
    // Always clean up temp files — even if transcription fails
    try {
      fs.unlinkSync(renamedPath);
    } catch (_) {}
    try {
      fs.unlinkSync(tempPath);
    } catch (_) {}
  }
});

module.exports = router;
