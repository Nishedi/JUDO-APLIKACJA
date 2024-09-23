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
                return '😐';  // Brak emotikony, jeśli nie ma odczuć
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