import styles from './CommonFunction.module.css';
export const GetFeelingsEmoticon = ({feelingsAfter}) => {
    const pickEmoticon = (feelingsAfter) => {
        switch (feelingsAfter) {
            case 'Bardzo źle':
                return '😢';  // Bardzo źle
            case 'Źle':
                return '🙁';  // Źle
            case 'Neutralnie':
                return '😐';  // Neutralnie
            case 'Dobrze':
                return '🙂';  // Dobrze
            case 'Bardzo dobrze':
                return '😊';  // Bardzo dobrze
            default:
                return '';  // Brak emotikony, jeśli nie ma odczuć
        }
    };
    return (
        <div>
            <span> {pickEmoticon(feelingsAfter)} </span>
        </div>
    );
};

export const TreningStatus = ({ treningStatus}) => {
    const getStatusEmoticon = (treningStatus) => {
        switch (treningStatus) {
            case 'Nierozpoczęty':
                return '⏳';  // Emotikona oczekiwania
            case 'Zrealizowany':
                return '✅';  // Emotikona wykonania
            case 'Niezrealizowany':
                return '❌';  // Emotikona niewykonania
            default:
                return '🤷';  // Emotikona na wypadek nieznanego statusu
        }
    };

    return (
        <div style={{fontSize: '16px'}}>
           <span>{getStatusEmoticon(treningStatus)}</span>
        </div>
    );
};


export const getActivityColor = (activity_type) => {
    switch (activity_type) {
        case 'Trening motoryczny':
            return '#FF7A68';
        case 'Biegowy':
            return '#95C6FF';
        case 'Na macie':
            return '#FFF281';
        case 'Fizjoterapia':
            return '#83FF8F';
        default:
            return '#FF7A68';
    }
}

export const getBorderColor = (activity_type) => {
    switch (activity_type) {
        case 'Trening motoryczny':
            return '#BE0000';
        case 'Biegowy':
            return '#0056BA';
        case 'Na macie':
            return '#CCB700';
        case 'Fizjoterapia':
            return '#00C514';
        default:
            return '#BE0000';
    } 
}

export const TreningStatusAndFeelingsAfter = ({ treningStatus, feelingsAfter }) => {
    const getStatusEmoticon = (treningStatus) => {
        switch (treningStatus) {
            case 'Nierozpoczęty':
                return '⏳';  // Emotikona oczekiwania
            case 'Zrealizowany':
                return '✅';  // Emotikona wykonania
            case 'Niezrealizowany':
                return '❌';  // Emotikona niewykonania
            default:
                return '🤷';  // Emotikona na wypadek nieznanego statusu
        }
    };
    const getFeelingsEmoticon = (feelingsAfter) => {
        switch (feelingsAfter) {
            case 'Bardzo źle':
                return '😢';  // Bardzo źle
            case 'Źle':
                return '😕';  // Źle
            case 'Neutralnie':
                return '😐';  // Neutralnie
            case 'Dobrze':
                return '🙂';  // Dobrze
            case 'Bardzo dobrze':
                return '😁';  // Bardzo dobrze
            default:
                return '';  // Brak emotikony, jeśli nie ma odczuć
        }
    };

    return (
        <div>
            <span>{getStatusEmoticon(treningStatus)}</span> {/* Emotikona statusu */}
            
            <span> {getFeelingsEmoticon(feelingsAfter)}</span>
           
        </div>
    );
};

export const setMoodFromEmoticon = (feelingsAfter, setSelectedMood) => {
    switch (feelingsAfter) {
        case '😢':
            setSelectedMood('Bardzo źle');  
            break; 
        case '🙁':
            setSelectedMood('Źle');
            break;
        case '😐':
            setSelectedMood('Neutralnie');  
            break;
        case '🙂':
            setSelectedMood('Dobrze'); 
            break;
        case '😊':
            setSelectedMood('Bardzo dobrze');  
            break;
        default:
            setSelectedMood('Neutralnie');
    }
  };

  export const pickEmoticon = (feelingsAfter) => {
    switch (feelingsAfter) {
        case 'Bardzo źle':
            return '😢';  // Bardzo źle
        case 'Źle':
            return '🙁';  // Źle
        case 'Neutralnie':
            return '😐';  // Neutralnie
        case 'Dobrze':
            return '🙂';  // Dobrze
        case 'Bardzo dobrze':
            return '😊';  // Bardzo dobrze
        default:
            return '';  // Brak emotikony, jeśli nie ma odczuć
    }
  };

  export const FeelingsAfter = ({feelingsAfter }) => {
    const getFeelingsEmoticon = (feelingsAfter) => {
        switch (feelingsAfter) {
            case 'Bardzo źle':
                return '😢';  // Bardzo źle
            case 'Źle':
                return '😕';  // Źle
            case 'Neutralnie':
                return '😐';  // Neutralnie
            case 'Dobrze':
                return '🙂';  // Dobrze
            case 'Bardzo dobrze':
                return '😁';  // Bardzo dobrze
            default:
                return '';  // Brak emotikony, jeśli nie ma odczuć
        }
    };

    return (
        <div className={styles.emotki}>
            <span style={{ marginRight: '10px' }}> {feelingsAfter} </span>
            <span style={{ verticalAlign: 'middle' }}> {getFeelingsEmoticon(feelingsAfter)} </span> 
        </div>
    );
};