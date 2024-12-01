import { useState, useCallback } from 'react';
import { Button } from "@arco-design/web-react";
import styles from './index.less';

const App = () => {
  const [result, setResult] = useState(100);
  const clickHandler = useCallback(() => {
    setResult(c=>c+1);
  }, []);

  return (
    <div className={styles.content} >
      {result}
      <Button type='primary' onClick={clickHandler}>
        add
      </Button>
    </div>
  );
};

export default App;
