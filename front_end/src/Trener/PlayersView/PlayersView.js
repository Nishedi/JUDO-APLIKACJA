import styles from "./PlayersView.module.css";
import SimpleInfo from "./SinglePlayerQuickInfo";

const PlayersView = () => {
    const players = [
        {
            name: "Piotr Kopiec",
            trainingCount: '1/2',
            wellBeing: 4,
            weight: 73
        },
        {
            name: "Bartłomiej Dobrowolski",
            trainingCount: '1/2',
            wellBeing: 5,
            weight: 80
        },
        {
            name: "Albert Pak",
            trainingCount: '1/2',
            wellBeing: 4,
            weight: 70
        },
        {
            name: "Piotr Wysocki",
            trainingCount: '1/2',
            wellBeing: 4,
            weight: 65
        }
        
    ];
    const now = new Date();
    const dayNames = ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"];
    const monthNames = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
        "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"];
    return (
        <div className={styles.background}>
            <div className={styles.navbar}>
                <div>
                    Burger
                </div>
                <div className="left_navbar">
                    <div className={styles.writing_div}>
                        Twoi ZAWODNICY
                    </div>
                    <div className={styles.date_div}>
                        {now.getDate()+" "+monthNames[now.getMonth()]+", "+dayNames[now.getDay()]}
                    </div>
                </div>
                
            </div>
            <div>
                {players.map((player) => {
                    return <SimpleInfo player={player} />
                })}
            </div>
        </div>
    );
}
export default PlayersView;