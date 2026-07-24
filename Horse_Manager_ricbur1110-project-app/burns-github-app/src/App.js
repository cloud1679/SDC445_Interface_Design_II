import HorseGraphic from './HorseGraphic';
import { useState } from 'react';
import HorseForm, {
  MAX_HORSE_NAME_LENGTH,
  MAX_NOTES_LENGTH,
  MAX_SHORT_FIELD_LENGTH,
} from './form';

function sanitizeTextInput(value, maxLength) {
  return value
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .slice(0, maxLength);
}

function sanitizeHorseName(value) {
  return sanitizeTextInput(value, MAX_HORSE_NAME_LENGTH);
}

function validateHorseName(value) {
  const trimmedName = value.trim();

  if (trimmedName === '') {
    return 'Please enter a horse name.';
  }

  if (!/^[a-zA-Z0-9 .'-]+$/.test(trimmedName)) {
    return 'Horse names can only include letters, numbers, spaces, periods, apostrophes, and hyphens.';
  }

  return '';
}

function Header() {
  return (
    <header>
      <h1>Horse Manager</h1>
      <p>Manage horse profiles, care notes, and stable information.</p>
    </header>
  );
}

function HorseList({ horses }) {
  return (
    <section>
      <h2>Horse Profiles</h2>

      {horses.length === 0 ? (
        <p>No horses have been added yet.</p>
      ) : (
        <ul>
          {horses.map((horse) => (
            <li key={horse.id}>
              <strong>{horse.name}</strong>
              {horse.gender && <span> | Gender: {horse.gender}</span>}
              {horse.type && <span> | Type: {horse.type}</span>}
              {horse.notes && <p>Notes: {horse.notes}</p>}
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
  const [horseNotes, setHorseNotes] = useState('');
  const [horseNameError, setHorseNameError] = useState('');
  const [horses, setHorses] = useState([]);
  const [editingHorseId, setEditingHorseId] = useState(null);
  const [message, setMessage] = useState('Ready to manage horses.');

  function handleHorseNameChange(event) {
    const sanitizedName = sanitizeHorseName(event.target.value);

    setHorseName(sanitizedName);
    setHorseNameError(validateHorseName(sanitizedName));
  }

  function handleGenderChange(event) {
    setHorseGender(sanitizeTextInput(event.target.value, MAX_SHORT_FIELD_LENGTH));
  }

  function handleTypeChange(event) {
    setHorseType(sanitizeTextInput(event.target.value, MAX_SHORT_FIELD_LENGTH));
  }

  function handleNotesChange(event) {
    setHorseNotes(sanitizeTextInput(event.target.value, MAX_NOTES_LENGTH));
  }

  function addHorse() {
    const trimmedName = horseName.trim();
    const validationError = validateHorseName(trimmedName);

    if (validationError) {
      setHorseNameError(validationError);
      setMessage(validationError);
      return;
    }

    const horseDetails = {
      name: trimmedName,
      gender: horseGender.trim(),
      type: horseType.trim(),
      notes: horseNotes.trim(),
    };

    if (editingHorseId) {
      setHorses((prevHorses) =>
        prevHorses.map((horse) =>
          horse.id === editingHorseId ? { ...horse, ...horseDetails } : horse
        )
      );
      setMessage(`${trimmedName} was updated.`);
    } else {
      const newHorse = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        ...horseDetails,
      };

      setHorses((prevHorses) => [...prevHorses, newHorse]);
      setMessage(`${trimmedName} was added.`);
    }

    setHorseName('');
    setHorseGender('');
    setHorseType('');
    setHorseNotes('');
    setHorseNameError('');
    setEditingHorseId(null);
  }

  function editHorse() {
    if (horses.length === 0) {
      setMessage('There are no horses to edit.');
      return;
    }

    const lastHorse = horses[horses.length - 1];
    setHorseName(lastHorse.name);
    setHorseGender(lastHorse.gender);
    setHorseType(lastHorse.type);
    setHorseNotes(lastHorse.notes);
    setHorseNameError('');
    setEditingHorseId(lastHorse.id);
    setMessage(`Loaded ${lastHorse.name} for editing.`);
  }

  function deleteHorse() {
    if (horses.length === 0) {
      setMessage('There are no horses to delete.');
      return;
    }

    const lastHorse = horses[horses.length - 1];
    setHorses((prevHorses) => prevHorses.slice(0, -1));

    if (editingHorseId === lastHorse.id) {
      setHorseName('');
      setHorseGender('');
      setHorseType('');
      setHorseNotes('');
      setHorseNameError('');
      setEditingHorseId(null);
    }

    setMessage('The last horse was deleted.');
  }

  const horseFields = [
    {
      id: 'horse-name',
      label: 'Horse Name',
      value: horseName,
      onChange: handleHorseNameChange,
      placeholder: 'Enter horse name',
      error: horseNameError,
      maxLength: MAX_HORSE_NAME_LENGTH,
    },
    {
      id: 'horse-gender',
      label: 'Gender',
      value: horseGender,
      onChange: handleGenderChange,
      placeholder: 'Enter gender',
      maxLength: MAX_SHORT_FIELD_LENGTH,
    },
    {
      id: 'horse-type',
      label: 'Type',
      value: horseType,
      onChange: handleTypeChange,
      placeholder: 'Enter horse type',
      maxLength: MAX_SHORT_FIELD_LENGTH,
    },
    {
      id: 'horse-notes',
      label: 'Notes',
      value: horseNotes,
      onChange: handleNotesChange,
      placeholder: 'Enter care notes',
      maxLength: MAX_NOTES_LENGTH,
    },
  ];

  const formActions = [
    {
      name: editingHorseId ? 'Save Changes' : 'Add Horse',
      onClick: addHorse,
      disabled: false,
    },
    { name: 'Edit Horse', onClick: editHorse, disabled: horses.length === 0 },
    { name: 'Delete Horse', onClick: deleteHorse, disabled: horses.length === 0 },
  ];

  return (
    <main>
      <Header />

      <HorseForm fields={horseFields} actions={formActions} />

      <p aria-live="polite">{message}</p>

      <HorseList horses={horses} />
      <HorseGraphic horses={horses} />
    </main>
  );
}
