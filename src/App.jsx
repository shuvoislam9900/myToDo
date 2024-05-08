import React, { useState, useEffect } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getDatabase,
  ref,
  set,
  push,
  onValue,
  remove,
  update,
} from "firebase/database";
import { MdDelete, MdEditDocument } from "react-icons/md";

const App = () => {
  const notify = () =>
    toast.error("please enter your task", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });
  const [task, settask] = useState("");
  const [taskError, settaskError] = useState("");
  const [done, setDone] = useState("");
  const [allTodos, setAllTodos] = useState([]);
  const [edit, setEdit] = useState(false);
  const [updatedTask, setUpdatedTask] = useState("");
  const [upId, setUpId] = useState("");
  const [change, setChange] = useState('')
  let handleTask = (tsk) => {
    settask(tsk.target.value);
    settaskError("");
    setDone("");
  };
  let handleSubmit = (btn) => {
    btn.preventDefault();

    if (task == "") {
      notify();
      settaskError("please add a task");
    } else {
      const db = getDatabase();
      set(push(ref(db, "todo/")), {
        todoName: task,
        img : change,
      }).then(() => {
        setDone("data saved successfully");
      });
      settask("");
    }
  };

  useEffect(() => {
    const db = getDatabase();
    const todoRef = ref(db, "todo/");
    onValue(todoRef, (snapshot) => {
      let array = [];
      snapshot.forEach((item) => {
        array.push({ value: item.val(), id: item.key });
      });

      setAllTodos(array);
    });
  }, []);
  let handleDelete = (id) => {
    const db = getDatabase();
    remove(ref(db, "todo/" + id));
  };

  let handleEditInput = (item) => {
    setEdit(true);
    setUpId(item.id);
    setUpdatedTask(item.value.todoName);
  };
  // let handleCancel = ()=>{
  //   setEdit(false);
  // }

  let handleUpdatedTask = (update) => {
    setUpdatedTask(update.target.value);
  };
  let handleUpdate = (e) => {
    const db = getDatabase();
    e.preventDefault();
    if (updatedTask == "") {
      alert("you haven't gave any updates");
    } else {
      update(ref(db, "todo/" + upId), { todoName: updatedTask });
      setEdit(false);
      setUpdatedTask("");
    }
  };

  let handleChange = (cng) =>{
      setChange(cng.target.value);
  };

  return (
    <div>
      <form className="max-w-sm mx-auto">
        <div className="mb-5 mt-10">
          <label
            htmlFor="email"
            className="block mb-2 text-lg font-bold text-gray-900"
          >
            Enter your task
          </label>
          <input onChange={handleChange} type="file"/>
          <input
            value={task}
            onChange={handleTask}
            type="text"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:font-bold dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Add your ToDo"
          />
          <h1>
            {taskError}
            {done}
          </h1>
        </div>
        <button
          onClick={handleSubmit}
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Submit
        </button>
        <div className=" mt-5">
          <ul className=" relative w-[384px] text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg">
            {allTodos.map((item) => (
              <li className="flex justify-between px-4 py-2 border-b border-gray-200 rounded-t-lg ">
                {item.value.todoName}
                <div className=" flex gap-4">
                  <MdEditDocument
                    onClick={() => handleEditInput(item)}
                    className=" size-5 text-blue-500"
                  />
                  <MdDelete
                    onClick={() => handleDelete(item.id)}
                    className=" size-5 text-red-400"
                  />
                </div>
              </li>
            ))}
            {edit && (
              <div className="flex items-center absolute w-full h-full top-0 left-0 rounded-md bg-sky-400">
                <div className=" p-10 w-full">
                  <input
                    value={updatedTask}
                    onChange={handleUpdatedTask}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5  "
                    type="text"
                    placeholder="Edit your task"
                  />
                  <div className=" flex justify-between mt-3">
                    <button
                      onClick={handleUpdate}
                      className=" text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => {
                        setEdit(false);
                      }}
                      className=" text-white bg-gray-500 hover:bg-gray-600 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center "
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </ul>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          transition={Bounce}
        />
      </form>
    </div>
  );
};

export default App;
