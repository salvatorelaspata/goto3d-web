import { formFields } from "@/utils/constants";
import { RadioCard } from "./RadioCard";
import { ChangeEvent } from "react";
import { RadioGroup } from "./_RadioGroup";

interface FormProjectProp {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  disabled?: boolean;
}
export const FormProject: React.FC<FormProjectProp> = ({
  onSubmit,
  disabled = false,
}) => {
  return (
    <form onSubmit={onSubmit} className="flex flex-col">
      <div className="flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="flex flex-col">
            <label htmlFor="name" className="text-lg">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="rounded-md shadow-md p-4 m-2"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="description" className="text-lg">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className="rounded-md shadow-md p-4 m-2"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <label htmlFor="files" className="text-lg">
          Files
        </label>
        <input
          type="file"
          id="files"
          name="files"
          className="rounded-md shadow-md p-4 m-2"
        />
      </div>
      {/* DETAILS */}
      <div className="flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="flex flex-col">
            <label htmlFor="detail" className="text-lg">
              Detail
            </label>
            <RadioGroup
              id="detail"
              label="Detail"
              name="detail"
              icon="detail"
              options={formFields[3].options}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                // console.log(e.target.value)
              }
              iValue="low"
              disabled={disabled}
            />
          </div>
          <div className="flex flex-col">
            <p>Spiegone</p>
          </div>
        </div>
      </div>

      {/* ORDERS */}
      <div className="flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="flex flex-col">
            <label htmlFor="order" className="text-lg">
              Order
            </label>
            <RadioGroup
              id="order"
              label="Order"
              name="order"
              icon="order"
              options={formFields[4].options}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                // console.log(e.target.value)
              }
              iValue="asc"
              disabled={disabled}
            />
          </div>
          <div className="flex flex-col">
            <p>Spiegone</p>
          </div>
        </div>
      </div>

      {/* FEATURE */}
      <div className="flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="flex flex-col">
            <label htmlFor="feature" className="text-lg">
              Feature
            </label>
            <RadioGroup
              id="feature"
              label="Feature"
              name="feature"
              icon="feature"
              options={formFields[5].options}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                // console.log(e.target.value)
              }
              iValue="all"
              disabled={disabled}
            />
          </div>
          <div className="flex flex-col">
            <p>Spiegone</p>
          </div>
        </div>
      </div>

      <div className="flex justify-around mt-10">
        {disabled ? (
          <>
            <button
              type="submit"
              disabled={disabled}
              className="rounded-md disabled:hover:scale-100 hover:scale-110 transition duration-300 ease-in-out shadow-md bg-palette1 text-white font-bold p-4 m-2 w-full"
            >
              Submit
            </button>
            <button
              type="reset"
              disabled={disabled}
              className="rounded-md shadow-md bg-palette3 p-4 m-2 w-full"
            >
              Reset
            </button>
          </>
        ) : null}
      </div>
    </form>
  );
};
