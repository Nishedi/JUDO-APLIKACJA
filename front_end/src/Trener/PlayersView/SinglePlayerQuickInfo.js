import styles2 from "./SignlePlayerQuickInfo.module.css";
const SimpleInfo = ({ player }) => {
    return (
        <div className={styles2.element}>
            {console.log(player)}
            <div className={styles2.mainString}>
                {player.name}
            </div>
            <div className={styles2.subString}>
                Stran treningów: {player.trainingCount}
            </div>
            <div className={styles2.subString}>
                Samopoczucie: {player.wellBeing}
            </div>
            <div className={styles2.subString}>
                Waga: {player.weight}
            </div>
        </div>
    );
}
export default SimpleInfo;