import styles from "./DayView.module.css";
const DayView = () => {
    return (
        <div className={styles.background}>
            <div className={styles.navbar}>
                <div>

                </div>
                <div className = {styles.weekDay}> 
                    <div >
                        Poniedziałek
                    </div>
                    <div className={styles.weekDayData}>
                        12 sierpnia
                    </div>
                </div>
                
                <div className={styles.name}>
                    Piotr Kopiec
                </div>
                



                
                {/* <div onClick={toggleSidebar}>
                    <RxHamburgerMenu className={styles.burger}/>
                </div>
                <div className="left_navbar">
                    <div className={styles.writing_div}>
                        Twoi ZAWODNICY
                    </div>
                    <div className={styles.date_div}>
                        {now.getDate()+" "+monthNames[now.getMonth()]+", "+dayNames[now.getDay()]}
                    </div>
                </div>   */}
            </div>
            <div>
                smierdzisz
            </div>
            
        </div>
    );
}
export default DayView;