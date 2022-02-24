import './App.css';
import app from './firebase';
import { getDatabase, ref, onValue } from "firebase/database";

const db = getDatabase(app);
const postsRef = ref(db, 'posts/1');
var data = "";
onValue(postsRef, (snapshot) => {
  data = snapshot.val();
  console.log(data);
});
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Engagement Dashboard
        </p>
        <p>
          Sample Data from database: {data["post_text"]}
        </p>

        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
