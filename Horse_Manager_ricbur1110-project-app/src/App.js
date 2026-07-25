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
              {horse.type && <span> | Type: {horse.type}</span>}
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

export default function App() {
  const [horseName, setHorseName] = useState('');
  const [horseGender, setHorseGender] = useState('');
  const [horseType, setHorseType] = useState('');
  const [horseNotes, setHorseNotes] = useState('');
  const [horseNameError, setHorseNameError] = useState('');
  const [horses, setHorses] = useState([]);
  const [editingHorseId, setEditingHorseId] = useState(null);
  const [message, setMessage] = useState('Ready to manage horses.');

  function resetForm() {
    setHorseName('');
    setHorseGender('');
    setHorseType('');
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
      label: 'Type',
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
        { value: 'Bay Roan', label: 'Bay Roan (Bay coat mixed with white hairs and dark points)' },
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
        { value: 'Pinto', label: 'Pinto (Horse with a spotted coat pattern)' },
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
          <a href="#horse-gender-chart">Horse Gender Chart</a>
          <a href="#horse-breed-chart">Horse Breed Chart</a>
        </nav>
        <HorseForm fields={fields} actions={actions} />
        <p aria-live="polite">{message}</p>
        <HorseList horses={horses} onEdit={editHorse} onDelete={deleteHorse} />
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
