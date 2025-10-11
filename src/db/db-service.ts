import { Alert } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
import RNRestart from 'react-native-restart';

const db = openDatabase({
  name: 'todo-sqlite',
});

export const getCategory = async (setData: Function) => {
  (await db).transaction(txn => {
    txn.executeSql(
      `SELECT * FROM todoList ORDER BY id DESC`,
      [],
      (sqlTxn, res) => {
        let len = res.rows.length;

        if (len > 0) {
          let results = [];
          for (let i = 0; i < len; i++) {
            console.log(res.rows.item(i));
            let item = res.rows.item(i);
            results.push({
              id: item.id,
              name: item.name,
            });
          }
          setData(results);
        }
      },
      error => {
        console.log('error on getting the categoriers ' + error.message);
      },
    );
  });
};

export const createTable = async () => {
  (await db).transaction(txn => {
    txn.executeSql(
      `CREATE TABLE IF NOT EXISTS todoList (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(20))`,
      [],
      (sqlTxn, res) => {
        console.log('Table created successfully');
      },
      error => {
        console.log('Error on creating the table ' + error.message);
      },
    );
  });
};

export const addCategory = async (task: string, setData: Function) => {
  if (!task) {
    Alert.alert('Please enter the task to submit');
    return;
  }
  (await db).transaction(txn => {
    txn.executeSql(
      `INSERT INTO todoList (name) VALUES (?)`,
      [task],
      (sqlTxn, res) => {
        console.log(`${task} category added successfully`);
        getCategory(setData);
      },
      error => {
        console.log('Error on adding task into the Table ' + error.message);
      },
    );
  });
};

export const resetCategory = async () => {
  (await db).transaction(txn => {
    txn.executeSql(
      `drop table todoList`,
      [],
      () => {
        console.log('Successfully deleted the table');
        RNRestart.restart();
      },
      error => {
        console.log(`error while deleting the table ${error.message}`);
      },
    );
  });
};

export const deleteCategory = async (id: number, setData: Function) => {
  (await db).transaction(txn => {
    txn.executeSql(
      `DELETE from todoList where rowid = ${id}`,
      [],
      () => {
        console.log('Successfully deleted the item with id ', id);
      },
      error => {
        console.log('Error while deleting the item with id ', error.message);
      },
    );
  });
  getCategory(setData);
};
