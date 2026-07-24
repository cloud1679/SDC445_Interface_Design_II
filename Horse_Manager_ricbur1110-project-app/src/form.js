import TextField from './TextField';

export const MAX_HORSE_NAME_LENGTH = 40;
export const MAX_SHORT_FIELD_LENGTH = 40;
export const MAX_NOTES_LENGTH = 160;

function HorseForm({ fields, actions }) {
  return (
    <section>
      <h2>Add Horse Information</h2>

      {fields.map((field) => (
        <TextField key={field.id} {...field} />
      ))}

      <div>
        {actions.map((action) => (
          <button
            key={action.name}
            type="button"
            onClick={action.onClick}
            disabled={action.disabled}
          >
            {action.name}
          </button>
        ))}
      </div>
    </section>
  );
}

export default HorseForm;
