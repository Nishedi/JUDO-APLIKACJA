import styles from './AddingPlayer.module.css';
const AddingPlayerFirstPage = () => {
    return (
        <div className = {styles.background}>
            <div className={styles.navbar}>
                DANE ZAWODNIKA
            </div>
            <div className={styles.content}>
                <div className={styles.inputs}>
                    <div className={styles.input_container}>
                        <div>IMIĘ</div>
                        <input type="text" className={styles.input} placeholder={'test'}/>
                    </div>
                    <div className={styles.input_container}>
                        <div>NAZWISKO</div>
                        <input type="text" className={styles.input} placeholder={'test'}/>
                    </div>
                    <div className={styles.input_container}>
                        <div>PŁEĆ</div>
                        <input type="text" className={styles.input} placeholder={'test'}/>
                    </div>
                    <div className={styles.input_container}>
                        <div>KATEGORIA WAGOWA</div>
                        <input type="text" className={styles.input} placeholder={'test'}/>
                    </div>
                    <div className={styles.input_container}>
                        <div>ROCZNIK</div>
                        <input type="text" className={styles.input} placeholder={'test'}/>
                    </div>


                    </div>
                <button className={styles.button}>Dalej</button>
            </div>
        </div>
    );
};
export default AddingPlayerFirstPage;