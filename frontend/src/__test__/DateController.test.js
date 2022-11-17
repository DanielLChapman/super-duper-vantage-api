import * as React from "react";
import * as TestUtils from "react-dom/test-utils";
import { expect, it, describe } from "@jest/globals";
import DateController from "../Components/DateHandler/DateController";
import ReactDOM from "react-dom/client";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("basic html checking", () => {
    let container;

    beforeEach(() => {
        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
        container = null;
    });
    it("Renders loading with no props", async () => {
        await TestUtils.act(async () => {
            await ReactDOM.createRoot(container).render(<DateController />);
        });

        const label = container.querySelector("span");

        expect(label.textContent).toBe("Loading...");
    });

    it("renders a form with props added in", async () => {
        const dateBuild = {
            month: 5,
            day: 11,
            year: 2023,
        };
        const updateHandler = (val, selector) => {};
        const updateAllDates = (m, d, y) => {};

        const { getByRole } = render(
            <DateController
                dateBuild={dateBuild}
                updateHandler={updateHandler}
                updateAllDates={updateAllDates}
            />
        );

        expect(screen.getByText("Check Date To Use:"));
        expect(getByRole("button").textContent).toBe("Set Sell Date");
        expect(screen.getAllByRole("spinbutton").length).toBe(3);
    });

    it("auto fixes a weekend date to the correct value", async () => {
        //get a weekend date
        let tempDate = new Date(Date.now());
        let toSubtract;
        if (tempDate.getDay() !== 0 || tempDate.getDay() !== 6) {
            //convert it to a sunday
            toSubtract = tempDate.getDay();
            tempDate.setDate(tempDate.getDate() - toSubtract);
        }

        const user = userEvent.setup();

        let dateBuild = {
            month: tempDate.getMonth() + 1,
            day: tempDate.getDate(),
            year: tempDate.getFullYear(),
        };
        let dateBuildCopy = {
            ...dateBuild,
        };

        const updateHandler = (val, selector) => {};
        const updateAllDates = (m, d, y) => {
            dateBuild = {
                month: m,
                day: d,
                year: y,
            };
        };

        const { getByRole } = render(
            <DateController
                dateBuild={dateBuild}
                updateHandler={updateHandler}
                updateAllDates={updateAllDates}
            />
        );

        await user.click(screen.getByTestId("date-controller-form-submit"));

        expect(dateBuild.day).toBeLessThan(dateBuildCopy.day);
    });
});

describe("It works for over 90 days", () => {
    let container;
    let dateBuild = {
        month: 5,
        day: 11,
        year: 2023,
    };
    const updateHandler = (val, selector) => {};
    const updateAllDates = (m, d, y) => {
      dateBuild = {
          month: m,
          day: d,
          year: y,
      };
  };

    beforeEach(() => {
        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
        container = null;
    });

    it("Presents 4 different options when using a day over 90 days ago.", async () => {
        //11-11-2021 should give 11-05-2021, 11-12-2021, 10-31-2021, 11-31-2021
        dateBuild = {
            month: 11,
            day: 11,
            year: 2021,
        };
        const { getByRole } = render(
            <DateController
                dateBuild={dateBuild}
                updateHandler={updateHandler}
                updateAllDates={updateAllDates}
            />
        );

        const user = userEvent.setup();

        await user.click(screen.getByTestId("date-controller-form-submit"));

        expect(screen.getByText('11 - 5 - 2021'));
        expect(screen.getByText('11 - 12 - 2021'));
        expect(screen.getByText('10 - 31 - 2021'));
        expect(screen.getByText('11 - 30 - 2021'));

        //clicking should update dateBuild
        await user.click(screen.getByText('11 - 5 - 2021'));
        expect(dateBuild.day).toBe(5);

    });
    
  it ('Correctly goes to the previous year.', async () => {
    //1-1-2022 should give 12-31-2021, 1-7-2022, 12-31-2021, 1-31-2022
        dateBuild = {
            month: 1,
            day: 1,
            year: 2022,
        };
        const { getByRole } = render(
            <DateController
                dateBuild={dateBuild}
                updateHandler={updateHandler}
                updateAllDates={updateAllDates}
            />
        );

        const user = userEvent.setup();

        await user.click(screen.getByTestId("date-controller-form-submit"));

        let test = await screen.getByTestId("monthly-offering-1");
        expect(test.innerHTML).toBe('12 - 31 - 2021')

  })
  
  it ('Correctly goes to the next year', async () => {
    dateBuild = {
      month: 12,
      day: 31,
      year: 2020,
  };
  const { getByRole } = render(
      <DateController
          dateBuild={dateBuild}
          updateHandler={updateHandler}
          updateAllDates={updateAllDates}
      />
  );

  const user = userEvent.setup();

  await user.click(screen.getByTestId("date-controller-form-submit"));

  expect(screen.getByText('1 - 1 - 2021'));

  })
});
