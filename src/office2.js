import React, { useState } from 'react';
import './office.css';
//עדכון שמות התוויות
const Office = () => {
  const [username, setUsername] = useState('');
  const [adrasse, setAdrasse] = useState('');
  const [telephon, setTelephon] = useState('');
  const [email, setEmail] = useState('');
  const [isInternetRequired, setIsInternetRequired] = useState(false);
  const [isKitchenRequires, setKitchenRequires] = useState(false);
  const [isCoffeemachineRequierd, setIsCoffeemachineRequierd] = useState(false);
  const [numberOfRooms, setNumberOfRooms] = useState('');
  const [distance, setDistance] = useState('');
  const [status, setStatus] = useState('מחפש');
  const [autocomplete, setAutocomplete] = useState([]);
//פונקציה אסיכרונית שתופסץ את הקלט שהמשתמש מזין
  const fetch_value = async (input) => {
    // מ-2 תווים ומעלה ישלח בקשה לשרת
    if (input.length < 2) return;
    //הקלט נשלח לשרת לאחר שהומר לjson
    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${input}&format=json`);
   //והמשתנה מקבל את התגובה מהשרת (רשימת כתובות אפשרית)
    const result = await response.json();
    setAutocomplete(result);
  };
  //הפונקציה הזו אחראית על  שינויים בקלט של המשתמש
  const Adress_change = (e) => {
    //המשתנה תופס את הקלט שהמשתמש מתחיל להזין
    const inputValue = e.target.value;
    //מעדכן את setAdress בשינוי
    setAdrasse(inputValue);
    //שולח לפונקציה שאחראית על שליחה לשרת
    fetch_value(inputValue);
  };
//פונקציה שמקבלת את הערכים שחזרו מהשרת
  const list_adress = (address) => {
    //מחזיקה את הכתובת שנמשתמש בוחר
    setAdrasse(address.display_name);
    // alert(address.display_name)
    //מנקה את רשימת הכתובות שחזר מהשרת-כבר מיותא לאחר הבחירה
    setAutocomplete([]);
  };
//(לא רלוונטית עכשיו)פונקציה שמטפלת בלחצן השליחה של הטופס
  const btn_submit = (event) => {
    event.preventDefault();

  };

  return (
    
    //כל "התוויות" שהקומפוננטה מחזירה
    //טופס
    <div>
      <h2>טופס משרד</h2>,
    <div className='formStyle'>
     
    <form onSubmit={btn_submit} >
      <div>
        <label>
          שם משתמש:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
      </div>
      <div id="adress_value">
        <label>
          כתובת:
          <input type="text" value={adrasse} onChange={Adress_change} placeholder='נא הזן כתובת' />
        </label>ְ
{/* במקרה שהרשימה שחוזרת מהשרת גדול מ-0 (יש תוצאות) */}

       {autocomplete.length > 0 && (
        //הנתונים נכנסים לul
          <ul>
          {/*   בעזרת הפונקציה הקבועה מטפ מסדרים את הערכים שחזרו מהשרת האינדקס הוא המיקום ברשימהה      */}
            {autocomplete.map((address, index) => (
              //כאשר המשתמש לוחץ על אחד מהכתובות ברשימה  הפונקציה list_adress מתבצעת עם הכתובת שנלחצה
              <li key={index} onClick={() => list_adress(address)}>
                {address.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <label>
          טלפון:
          <input type="text" value={telephon} onChange={(e) => setTelephon(e.target.value)} />
        </label>
      </div>
      <div>
        דואר אלקטרוני:
        <label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
      </div>

      <div className='chackboxGroup'>
        <label>
        האם נדרש אינטרנט במשרד?
          <input
            type="checkbox" checked={isInternetRequired} onChange={(e) => setIsInternetRequired(e.target.checked)}
          />
          
        </label>
      </div>
      <div className='chackboxGroup'>
        <label>
        האם נדרש מטבח במשרד?
          <input
            type="checkbox" checked={isKitchenRequires} onChange={(e) => setKitchenRequires(e.target.checked)}
          />
         
        </label>
      </div>
      <div className='chackboxGroup'>
        <label>
        האם נדרש מכונת קפה?
          <input
            type="checkbox" checked={isCoffeemachineRequierd} onChange={(e) => setIsCoffeemachineRequierd(e.target.checked)}
          />
        
        </label>
      </div>
      <div>
        <label>
          מספר חדרים:
          <input type="number" value={numberOfRooms} onChange={(e) => setNumberOfRooms(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          כמה תוכל להתרחק?
          <input type="number" value={distance} onChange={(e) => setDistance(e.target.value)} />
        </label>
      </div>
      <div>
        <label>סטטוס חיפוש:</label>
        <p>{status}</p>
        {status === 'מחפש' && (
          <button onClick={() => setStatus('בוטל')}>
            ביטול חיפוש
          </button>
        )}
      </div>
      <button type="submit">שלח</button>
    </form>
    </div>
    </div>
  );
};

export default Office;
