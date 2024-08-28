// import styles from './AddingActivity.module.css';
// const AddiActivityFirstPage = () => {
//     this.state = {
//         options: [{name: 'Option 1', id: 1},{name: 'Option 2', id: 2}]
//     };
//     onSelect(selectedList, selectedItem) {
//         console.log(selectedItem);
//     }
//     onRemove(selectedList, removedItem) {
//         console.log(removedItem);
//     }
//     return (
//         <div className={styles.background}>
//             <div className={styles.navbar}>
//                 Nowa Aktywność
//             </div>
//             A
//         </div>
//     );
// }
// export default AddiActivityFirstPage;
import styles from './AddingActivity.module.css';
import { useState, useContext, useEffect } from 'react';
import Multiselect from 'multiselect-react-dropdown';
import { GlobalContext } from '../../GlobalContext';
import { createClient } from '@supabase/supabase-js';
import { Calendar } from 'primereact/calendar';


const AddingActivityFirstPage = () => {
    const { globalVariable } = useContext(GlobalContext);
    const supabaseUrl = 'https://akxozdmzzqcviqoejhfj.supabase.co';
    const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFreG96ZG16enFjdmlxb2VqaGZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQyNTA3NDYsImV4cCI6MjAzOTgyNjc0Nn0.FoI4uG4VI_okBCTgfgIPIsJHWxB6I6ylOjJEm40qEb4";
    const supabase = createClient(supabaseUrl, supabaseKey)
    const [dates, setDates] = useState(null);
    // Initialize state using the useState hook
    const [options, setOptions] = useState([
        { name: 'Option 1', id: 1 },
        { name: 'Option 2', id: 2 },
        { name: 'Option 3', id: 3 },
        { name: 'Option 4', id: 4 },
        { name: 'Option 5', id: 5 }
    ]);

    const initiateOptions = async () => {
        let { data: zawodnicy, error } = await supabase
            .from('zawodnicy')
            .select('*')
            .eq('id_trenera', globalVariable.id)

        if(zawodnicy.length!==0){
            setOptions(zawodnicy.map(zawodnik => {return {name: zawodnik.imie + ' ' + zawodnik.nazwisko, id: zawodnik.id}}));
        }
        
    }

    useEffect(() => {
        initiateOptions();
    }, []);


    const [selectedOptions, setSelectedOptions] = useState([]);

    // Define onSelect function for handling selection
    const onSelect = (selectedList, selectedItem) => {
        console.log('Selected Item:', selectedItem);
        setSelectedOptions(selectedList);  // Update selected options
        console.log(selectedOptions);
    };

    // Define onRemove function for handling removal
    const onRemove = (selectedList, removedItem) => {
        console.log('Removed Item:', removedItem);
        setSelectedOptions(selectedList);  // Update selected options
        
    };

    const showSelectedOptions = () => {
        console.log(selectedOptions);
    };

    return (
        <div className={styles.background}>
            <div className={styles.navbar}>
                Nowa Aktywność
            </div>
            <div className={styles.content}>
                <div className={styles.input_container}>
                Wybierz zawodników
                <Multiselect
                    options={options} // Use 'options' state directly
                    selectedValues={selectedOptions} // Use 'selectedOptions' state directly
                    onSelect={onSelect} // Directly reference onSelect function
                    onRemove={onRemove} // Directly reference onRemove function
                    displayValue="name" // Property name to display in the dropdown options
                    placeholder='Wybierz zawodników'
                    style={{
                        chips: {
                            color: '#000'
                        },
                        multiselectContainer: {
                            color: '#000',
                            width: '95%'
                        },
                        searchBox: {
                            border: '1px solid #ccc',
                            color: '#000',
                            backgroundColor: '#FFF',
                            borderRadius: '10px'
                        },
                       
                        optionContainer: {
                            background: '#f8f8f8',
                            border: '1px solid #ccc'
                        },
                        option: {
                            padding: '5px 10px',
                            cursor: 'pointer',
                        },
                        selectedOption: {
                            // background: '#d1e7dd',
                            fontWeight: 'bold'
                        }
                    }}
               />
                </div>
                <div className={styles.input_container}>
                    <div className="field col-12 md:col-4">
                            <label htmlFor="multiple">Multiple</label>
                            <Calendar id="multiple" value={null}  selectionMode="multiple" readOnlyInput />
                        </div>
                    <div className="card flex justify-content-center"> 
                    <Calendar 
                        value={dates} 
                        onChange={(e) => setDates(e.value)} 
                        selectionMode="multiple"
                        readOnlyInput 
                        className="custom-calendar" 
                        style={{ borderRadius: '10px', backgroundColor: '#f8f8f8', border: '1px solid #ccc' }} 
                    />

                     </div>
                       
                </div>
               <button onClick={showSelectedOptions}>Show selected options</button>
            </div>
            
           
        </div>
    );
};

export default AddingActivityFirstPage;
