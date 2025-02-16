import React, { useState } from 'react';
import './office2.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// תיקון בעיית אייקון המארקר
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

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
  const [coordinates, setCoordinates] = useState({ lat: null, lon: null });
  
  //פונקציה אסיכרונית שתופסץ את הקלט שהמשתמש מזין
  const fetch_value = async (input) => {
    if (input.length < 2) return;
    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${input}&format=json`);
    const result = await response.json();
    setAutocomplete(result);
  };

  // הפונקציה הזו אחראית על  שינויים בקלט של המשתמש
  const Adress_change = (e) => {
    const inputValue = e.target.value;
    setAdrasse(inputValue);
    fetch_value(inputValue);
  };

  // פונקציה שמקבלת את הערכים שחזרו מהשרת
  const list_adress = (address) => {
    setAdrasse(address.display_name);
    setCoordinates({ lat: parseFloat(address.lat), lon: parseFloat(address.lon) });
    setAutocomplete([]);
  };

  //(לא רלוונטית עכשיו)פונקציה שמטפלת בלחצן השליחה של הטופס
  const btn_submit = (event) => {
    event.preventDefault();
  };

  return (
    <div>
      <h2>טופס משרד</h2>
      <div className='formStyle'>
        <form onSubmit={btn_submit}>
          {/* שדות הקלט הקיימים */}
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
            </label>
            {autocomplete.length > 0 && (
              <ul>
                {autocomplete.map((address, index) => (
                  <li key={index} onClick={() => list_adress(address)}>
                    {address.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* שדות הקלט הנוספים שלך */}
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
              <input type="checkbox" checked={isInternetRequired} onChange={(e) => setIsInternetRequired(e.target.checked)} />
            </label>
          </div>
          <div className='chackboxGroup'>
            <label>
              האם נדרש מטבח במשרד?
              <input type="checkbox" checked={isKitchenRequires} onChange={(e) => setKitchenRequires(e.target.checked)} />
            </label>
          </div>
          <div className='chackboxGroup'>
            <label>
              האם נדרש מכונת קפה?
              <input type="checkbox" checked={isCoffeemachineRequierd} onChange={(e) => setIsCoffeemachineRequierd(e.target.checked)} />
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

        {/* הצגת המפה */}
        {coordinates.lat && coordinates.lon && (
          <MapContainer center={[coordinates.lat, coordinates.lon]} zoom={13} style={{ height: '400px', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[coordinates.lat, coordinates.lon]}>
              <Popup>{adrasse}</Popup>
            </Marker>
          </MapContainer>
        )}
      </div>
    </div>
  );
};

export default Office;
