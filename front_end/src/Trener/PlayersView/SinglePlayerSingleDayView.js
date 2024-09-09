import styles from "./SinglePlayerSingleDayView.module.css";

const SinglePlayerSingleDayView = ({day}) => {
    return (
        <div className={styles.singleDayContainer}>
            {console.log(day)}
            <div className={styles.singleDay}>
                {day}
                hi
            </div>
        </div>
    );
}
export default SinglePlayerSingleDayView;