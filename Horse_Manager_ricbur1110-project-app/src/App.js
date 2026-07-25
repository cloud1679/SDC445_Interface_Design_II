import { useState } from 'react';
import HorseGraphic from './HorseGraphic';
import HorseForm, {
  MAX_HORSE_NAME_LENGTH,
  MAX_NOTES_LENGTH,
  MAX_SHORT_FIELD_LENGTH,
} from './form';

function sanitizeTextInput(value, maxLength) {
  return value.replace(/[<>]/g, '').replace(/\s+/g, ' ').slice(0, maxLength);
}

function validateHorseName(value) {
  const trimmedName = value.trim();

  if (trimmedName === '') return 'Please enter a horse name.';
  if (!/^[a-zA-Z0-9 .'-]+$/.test(trimmedName)) {
    return 'Horse names can only include letters, numbers, spaces, periods, apostrophes, and hyphens.';
  }
  return '';
}

function HorseList({ horses, onEdit, onDelete }) {
  return (
    <section id="horse-profiles">
      <h2>Horse Profiles</h2>
      {horses.length === 0 ? (
        <p>No horses have been added yet.</p>
      ) : (
        <ul>
          {horses.map((horse) => (
            <li key={horse.id}>
              <strong>{horse.name}</strong>
              {horse.gender && <span> | Gender: {horse.gender}</span>}
              {horse.type && <span> | Breed: {horse.type}</span>}
              {horse.color && <span> | Color: {horse.color}</span>}
              {horse.notes && <p>Notes: {horse.notes}</p>}
              <button type="button" onClick={() => onEdit(horse.id)}>
                Edit {horse.name}
              </button>
              <button type="button" onClick={() => onDelete(horse.id)}>
                Delete {horse.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Appointments({
  appointmentName,
  appointmentDate,
  appointmentTime,
  appointments,
  onNameChange,
  onDateChange,
  onTimeChange,
  onAdd,
  onDelete,
}) {
  function formatDate(dateValue) {
    const [year, month, day] = dateValue.split('-').map(Number);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(year, month - 1, day));
  }

  function formatTime(timeValue) {
    const [hour, minute] = timeValue.split(':').map(Number);
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(2000, 0, 1, hour, minute));
  }

  return (
    <section id="appointments">
      <h2>Appointments</h2>
      <div className="text-field">
        <label htmlFor="appointment-name">Appointment Purpose</label>
        <input
          id="appointment-name"
          type="text"
          value={appointmentName}
          onChange={onNameChange}
          placeholder="Example: Farrier visit"
          maxLength={60}
        />
      </div>
      <div className="text-field">
        <label htmlFor="appointment-date">Appointment Date</label>
        <input
          id="appointment-date"
          type="date"
          value={appointmentDate}
          onChange={onDateChange}
        />
      </div>
      <div className="text-field">
        <label htmlFor="appointment-time">Appointment Time</label>
        <input
          id="appointment-time"
          type="time"
          value={appointmentTime}
          onChange={onTimeChange}
        />
      </div>
      <button type="button" onClick={onAdd}>
        Add Appointment
      </button>

      {appointments.length === 0 ? (
        <p>No appointments have been scheduled.</p>
      ) : (
        <ul>
          {appointments.map((appointment) => (
            <li key={appointment.id}>
              <strong>{appointment.name}</strong>
              <span>
                {' '}| {formatDate(appointment.date)} at {formatTime(appointment.time)}
              </span>
              <button type="button" onClick={() => onDelete(appointment.id)}>
                Delete appointment
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default function App() {
  const [horseName, setHorseName] = useState('');
  const [horseGender, setHorseGender] = useState('');
  const [horseType, setHorseType] = useState('');
  const [horseColor, setHorseColor] = useState('');
  const [horseNotes, setHorseNotes] = useState('');
  const [horseNameError, setHorseNameError] = useState('');
  const [horses, setHorses] = useState([]);
  const [editingHorseId, setEditingHorseId] = useState(null);
  const [message, setMessage] = useState('Ready to manage horses.');
  const [appointmentName, setAppointmentName] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [appointments, setAppointments] = useState([]);

  function resetForm() {
    setHorseName('');
    setHorseGender('');
    setHorseType('');
    setHorseColor('');
    setHorseNotes('');
    setHorseNameError('');
    setEditingHorseId(null);
  }

  function addHorse() {
    const trimmedName = horseName.trim();
    const validationError = validateHorseName(trimmedName);
    if (validationError) {
      setHorseNameError(validationError);
      setMessage(validationError);
      return;
    }

    const details = {
      name: trimmedName,
      gender: horseGender.trim(),
      type: horseType.trim(),
      color: horseColor.trim(),
      notes: horseNotes.trim(),
    };

    if (editingHorseId) {
      setHorses((current) =>
        current.map((horse) =>
          horse.id === editingHorseId ? { ...horse, ...details } : horse
        )
      );
      setMessage(`${trimmedName} was updated.`);
    } else {
      setHorses((current) => [
        ...current,
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          ...details,
        },
      ]);
      setMessage(`${trimmedName} was added.`);
    }
    resetForm();
  }

  function editHorse(horseId) {
    const horse = horses.find((item) => item.id === horseId);
    if (!horse) {
      setMessage('That horse could not be found.');
      return;
    }

    setHorseName(horse.name);
    setHorseGender(horse.gender);
    setHorseType(horse.type);
    setHorseColor(horse.color || '');
    setHorseNotes(horse.notes);
    setHorseNameError('');
    setEditingHorseId(horse.id);
    setMessage(`Loaded ${horse.name} for editing.`);
  }

  function deleteHorse(horseId) {
    const horse = horses.find((item) => item.id === horseId);
    if (!horse) {
      setMessage('That horse could not be found.');
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${horse.name}?`
    );
    if (!confirmed) {
      setMessage(`${horse.name} was not deleted.`);
      return;
    }

    setHorses((current) => current.filter((item) => item.id !== horseId));
    if (editingHorseId === horseId) resetForm();
    setMessage(`${horse.name} was deleted.`);
  }

  function addAppointment() {
    const name = appointmentName.trim();
    if (!name || !appointmentDate || !appointmentTime) {
      setMessage('Please enter an appointment purpose, date, and time.');
      return;
    }

    setAppointments((current) =>
      [...current, {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name,
        date: appointmentDate,
        time: appointmentTime,
      }].sort((a, b) =>
        `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`)
      )
    );
    setAppointmentName('');
    setAppointmentDate('');
    setAppointmentTime('');
    setMessage(`${name} was scheduled.`);
  }

  function deleteAppointment(appointmentId) {
    setAppointments((current) =>
      current.filter((appointment) => appointment.id !== appointmentId)
    );
    setMessage('The appointment was deleted.');
  }

  const fields = [
    {
      id: 'horse-name',
      label: 'Horse Name',
      value: horseName,
      onChange: (event) => {
        const value = sanitizeTextInput(event.target.value, MAX_HORSE_NAME_LENGTH);
        setHorseName(value);
        setHorseNameError(validateHorseName(value));
      },
      placeholder: 'Enter horse name',
      error: horseNameError,
      maxLength: MAX_HORSE_NAME_LENGTH,
    },
    {
      id: 'horse-gender',
      label: 'Gender',
      value: horseGender,
      onChange: (event) => setHorseGender(event.target.value),
      selectPlaceholder: 'Select gender',
      options: [
        { value: 'Mare', label: 'Mare (Adult female)' },
        { value: 'Filly', label: 'Filly (Young female)' },
        { value: 'Stallion', label: 'Stallion (Adult uncastrated male)' },
        { value: 'Colt', label: 'Colt (Young male)' },
        { value: 'Gelding', label: 'Gelding (Castrated male)' },
      ],
    },
    {
      id: 'horse-type',
      label: 'Breed',
      value: horseType,
      onChange: (event) => setHorseType(event.target.value),
      selectPlaceholder: 'Select breed',
      options: [
        { value: 'American Paint Horse', label: 'American Paint Horse (Colorful Western stock horse)' },
        { value: 'American Quarter Horse', label: 'American Quarter Horse (Versatile, athletic sprinter)' },
        { value: 'American Saddlebred', label: 'American Saddlebred (Elegant high-stepping riding horse)' },
        { value: 'Andalusian', label: 'Andalusian (Graceful Spanish riding horse)' },
        { value: 'Appaloosa', label: 'Appaloosa (Spotted, hardy stock horse)' },
        { value: 'Arabian', label: 'Arabian (Enduring, refined desert breed)' },
        { value: 'Belgian Draft', label: 'Belgian Draft (Powerful, gentle draft horse)' },
        { value: 'Clydesdale', label: 'Clydesdale (Large feather-legged draft horse)' },
        { value: 'Friesian', label: 'Friesian (Black, elegant carriage horse)' },
        { value: 'Gypsy Vanner', label: 'Gypsy Vanner (Feathered, compact cob)' },
        { value: 'Haflinger', label: 'Haflinger (Small, sturdy chestnut horse)' },
        { value: 'Hanoverian', label: 'Hanoverian (Athletic German sport horse)' },
        { value: 'Icelandic Horse', label: 'Icelandic Horse (Small, hardy gaited breed)' },
        { value: 'Miniature Horse', label: 'Miniature Horse (Horse bred for very small size)' },
        { value: 'Morgan', label: 'Morgan (Compact, versatile American breed)' },
        { value: 'Mustang', label: 'Mustang (Hardy free-roaming American horse)' },
        { value: 'Oldenburg', label: 'Oldenburg (Powerful German sport horse)' },
        { value: 'Paso Fino', label: 'Paso Fino (Smooth-gaited Latin American breed)' },
        { value: 'Percheron', label: 'Percheron (Strong, agile French draft horse)' },
        { value: 'Shetland Pony', label: 'Shetland Pony (Small, strong island pony)' },
        { value: 'Shire', label: 'Shire (Very large British draft horse)' },
        { value: 'Standardbred', label: 'Standardbred (Harness-racing and driving horse)' },
        { value: 'Tennessee Walking Horse', label: 'Tennessee Walking Horse (Smooth-gaited trail horse)' },
        { value: 'Thoroughbred', label: 'Thoroughbred (Fast, athletic racing breed)' },
        { value: 'Trakehner', label: 'Trakehner (Refined German sport horse)' },
        { value: 'Welsh Pony and Cob', label: 'Welsh Pony and Cob (Hardy, versatile Welsh breed)' },
      ],
    },
    {
      id: 'horse-color',
      label: 'Color',
      value: horseColor,
      onChange: (event) => setHorseColor(event.target.value),
      selectPlaceholder: 'Select color',
      options: [
        { value: 'Bay', label: 'Bay (Brown body with black mane, tail, and legs)' },
        { value: 'Bay Roan', label: 'Bay Roan (Bay coat evenly mixed with white hairs)' },
        { value: 'Black', label: 'Black (Black coat, mane, tail, and points)' },
        { value: 'Blanket Appaloosa', label: 'Blanket Appaloosa (White rump area with or without spots)' },
        { value: 'Blue Roan', label: 'Blue Roan (Black coat mixed with white hairs)' },
        { value: 'Buckskin', label: 'Buckskin (Golden body with black points)' },
        { value: 'Champagne', label: 'Champagne (Metallic coat with mottled pink skin)' },
        { value: 'Chestnut', label: 'Chestnut (Red-brown body with matching points)' },
        { value: 'Cremello', label: 'Cremello (Pale cream coat with blue eyes)' },
        { value: 'Dark Bay', label: 'Dark Bay (Deep brown body with black mane, tail, and legs)' },
        { value: 'Dapple Gray', label: 'Dapple Gray (Gray coat with lighter circular markings)' },
        { value: 'Dominant White', label: 'Dominant White (Mostly white coat with pink skin)' },
        { value: 'Dun', label: 'Dun (Tan coat with dorsal stripe and dark points)' },
        { value: 'Fewspot Leopard', label: 'Fewspot Leopard (Mostly white Appaloosa pattern with few spots)' },
        { value: 'Flea-Bitten Gray', label: 'Flea-Bitten Gray (Light gray with small dark speckles)' },
        { value: 'Flaxen Chestnut', label: 'Flaxen Chestnut (Chestnut coat with pale mane and tail)' },
        { value: 'Gray', label: 'Gray (Coat that lightens with age)' },
        { value: 'Grullo', label: 'Grullo (Smoky gray dun with black points)' },
        { value: 'Leopard Appaloosa', label: 'Leopard Appaloosa (White coat with dark spots)' },
        { value: 'Liver Chestnut', label: 'Liver Chestnut (Very dark red-brown chestnut coat)' },
        { value: 'Mouse Dun', label: 'Mouse Dun (Gray-tan dun with dark primitive markings)' },
        { value: 'Palomino', label: 'Palomino (Golden coat with cream or white mane)' },
        { value: 'Perlino', label: 'Perlino (Cream coat with reddish points and blue eyes)' },
        { value: 'Pinto', label: 'Pinto (Large areas of white and another coat color)' },
        { value: 'Rabicano', label: 'Rabicano (White ticking concentrated on flanks and tail)' },
        { value: 'Red Roan', label: 'Red Roan (Chestnut coat mixed with white hairs)' },
        { value: 'Sabino', label: 'Sabino (Irregular white legs and belly markings)' },
        { value: 'Silver Dapple', label: 'Silver Dapple (Dark coat with a silver mane and tail)' },
        { value: 'Smoky Black', label: 'Smoky Black (Black coat carrying one cream gene)' },
        { value: 'Sorrel', label: 'Sorrel (Bright copper-red form of chestnut)' },
        { value: 'Splash White', label: 'Splash White (Crisp white markings rising from below)' },
        { value: 'Tobiano Pinto', label: 'Tobiano Pinto (Rounded white patches crossing the back)' },
        { value: 'Overo Pinto', label: 'Overo Pinto (Irregular white patches not crossing the back)' },
        { value: 'Tovero Pinto', label: 'Tovero Pinto (Combination of tobiano and overo patterns)' },
        { value: 'Varnish Roan', label: 'Varnish Roan (Appaloosa pattern that lightens over time)' },
        { value: 'White', label: 'White (White coat with unpigmented skin)' },
      ],
    },
    {
      id: 'horse-notes',
      label: 'Notes',
      value: horseNotes,
      onChange: (event) =>
        setHorseNotes(sanitizeTextInput(event.target.value, MAX_NOTES_LENGTH)),
      placeholder: 'Enter care notes',
      maxLength: MAX_NOTES_LENGTH,
    },
  ];

  const actions = [
    { name: editingHorseId ? 'Save Changes' : 'Add Horse', onClick: addHorse },
  ];

  return (
    <>
      <img
        className="side-photo side-photo-left"
        src="/images/wild-horses-left.jpg"
        alt="A herd of wild horses in a mountain landscape"
      />
      <main>
        <header>
          <h1>Horse Manager</h1>
          <p>Manage horse profiles, care notes, and stable information.</p>
        </header>
        <nav aria-label="Page sections">
          <a href="#horse-profiles">Horse Profiles</a>
          <a href="#appointments">Appointments</a>
          <a href="#horse-gender-chart">Horse Gender Chart</a>
          <a href="#horse-breed-chart">Horse Breed Chart</a>
        </nav>
        <HorseForm fields={fields} actions={actions} />
        <p aria-live="polite">{message}</p>
        <HorseList horses={horses} onEdit={editHorse} onDelete={deleteHorse} />
        <Appointments
          appointmentName={appointmentName}
          appointmentDate={appointmentDate}
          appointmentTime={appointmentTime}
          appointments={appointments}
          onNameChange={(event) =>
            setAppointmentName(sanitizeTextInput(event.target.value, 60))
          }
          onDateChange={(event) => setAppointmentDate(event.target.value)}
          onTimeChange={(event) => setAppointmentTime(event.target.value)}
          onAdd={addAppointment}
          onDelete={deleteAppointment}
        />
        <HorseGraphic horses={horses} />
      </main>
      <img
        className="side-photo side-photo-right"
        src="/images/wild-horses-right.jpg"
        alt="Wild horses gathered beneath distant mountains"
      />
    </>
  );
}
