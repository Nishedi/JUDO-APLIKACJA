import styles from './CommonFunction.module.css';

export const getMultiDayActivityColor = (type) => {
    switch (type) {
        case 'oboz':
            return '#C2FF70'; // Zielony
        case 'zawody':
            return '#FFE779'; // złoty
        case 'kontuzja':
            return '#fa6464'; // Czerwony
        case 'inne':
        default:
            return '#fff'; // Szary
    }
};

export const sharedStyles = {
        chips: {
            color: '#f8f8f8',
            fontSize: '1rem',
            padding: '2px 8px',
            backgroundColor: '#1D61DC',
            margin: '0px',
        },
        multiselectContainer: {
            color: '#000',
            width: '100%'
        },
        searchBox: {
            border: '1px solid #ccc',
            color: '#000',
            backgroundColor: '#FFF',
            borderRadius: '3px',
            padding: '8px'
        },
        optionContainer: {
            color: 'red',
            background: '#f8f8f8',
            border: '1px solid #ccc'
        },
        option: {
            color: '#000',
            background: '#f8f8f8',
            padding: '5px 10px',
            fontSize: '1rem',
            cursor: 'pointer',
        },
        selectedOption: {
            fontWeight: 'bold',
            fontSize: '15px',
        }
    };

export const sharedStyles2 = {
        chips: {
            color: '#f8f8f8',
            fontSize: '1rem',
            padding: '2px 8px',
            backgroundColor: '#1D61DC',
            margin: '0px',
        },
        multiselectContainer: {
            color: '#000',
            width: '100%'
        },
        searchBox: {
            color: '#000',
            backgroundColor: '#FFF',
            borderRadius: '3px',
            padding: '8px',
            border: '0px solid #ccc',
            height: 'fit-content' 
        },
        optionContainer: {
            color: 'red',
            background: '#f8f8f8',
            border: '1px solid #ccc'
        },
        option: {
            color: '#000',
            background: '#f8f8f8',
            padding: '5px 10px',
            fontSize: '1rem',
            cursor: 'pointer',
        },
        selectedOption: {
            fontWeight: 'bold',
            fontSize: '15px',
        }
    };
    

export const getMultiDayActivityBorderColor = (type) => {
    switch (type) {
        case 'oboz':
            return '#315400'; // Zielony
        case 'zawody':
            return '#4d3f01'; // Zloty
        case 'kontuzja':
            return '#3d0102'; // Czerwony
        case 'inne':
        default:
            return '#030391'; // Szary
    }
};

export const getMultiDayActivityEmoji = (type) => {
    switch (type) {
        case 'oboz':
            return '🏕️';
        case 'zawody':
            return '🏆';
        case 'kontuzja':
            return '🩹';
        case 'inne':
        default:
            return '📌';
    }
};



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
        case 'Motoryczny':
            return '#FF7A68';
        case 'Biegowy':
            return '#95C6FF';
        case 'Na macie':
            return '#FFF281';
        case 'Fizjoterapia':
            return '#83FF8F';
        
        default:
            return '#E6E6FA';
    }
}

export const getActivityTypeColor = (additional_activity_type) => {
    switch (additional_activity_type) {
        case 'taktyczny':
            return '#0000FF'; // Niebieski
        case 'motoryczny':
            return '#B22222'; // Czerwony
        case 'mentalny':
            return '#32CD32'; // Zielony
        default:
            return '#000'; // Domyślny kolor (np. jasny fiolet)
    }
}

export const getBorderColor = (activity_type) => {
    switch (activity_type) {
        case 'Motoryczny':
            return '#BE0000';
        case 'Biegowy':
            return '#0056BA';
        case 'Na macie':
            return '#CCB700';
        case 'Fizjoterapia':
            return '#00C514';
        default:
            return '#B1B1EF';
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
                return '😊';  // Bardzo dobrze
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

  export const getMoodFromEmoticon = (feelingsAfter, setSelectedMood) => {
    switch (feelingsAfter) {
        case '😢':
            return 'Bardzo źle';
        case '🙁':
            return 'Źle';
        case '😐':
            return 'Neutralnie';
        case '🙂':
            return 'Dobrze';
        case '😊':
            return 'Bardzo dobrze';
        default:
            return '';
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
                return '😊';  // Bardzo dobrze
            default:
                return '';  // Brak emotikony, jeśli nie ma odczuć
        }
    };

    return (
        <div className={styles.emotki}>
            <span className={styles.feelingsText} style={{ marginRight: '10px' }}> {feelingsAfter} </span>
            <span className={styles.feelingsEmoticon} style={{ verticalAlign: 'middle' }}> {getFeelingsEmoticon(feelingsAfter)} </span>
        </div>
    );
};