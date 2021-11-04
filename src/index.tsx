import 'bulmaswatch/superhero/bulmaswatch.min.css';
import ReactDOM from 'react-dom';
import { CodeCell } from './components/code-cell';

const App = () => (
  <>
    <CodeCell />
  </>
);

// Render the App component on the screen.
ReactDOM.render(<App />, document.querySelector('#root'));
