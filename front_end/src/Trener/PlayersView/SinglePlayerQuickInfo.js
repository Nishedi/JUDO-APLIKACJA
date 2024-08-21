import styles2 from "./SignlePlayerQuickInfo.module.css";
const SimpleInfo = ({ player }) => {
    return (
        <div className={styles2.element}>
            <div className={styles2.mainString}>
                {player.imie} {player.nazwisko}
            </div>
            <div className={styles2.subString}>
                Stran treningów: {player.stan_treningow}
            </div>
            <div className={styles2.subString}>
                Samopoczucie: {player.samopoczucie}
            </div>
            <div className={styles2.subString}>
                Waga: {player.waga}
            </div>
        </div>
    );
}
export default SimpleInfo;