import React, { useState } from "react";
import {
    render,
    screen,
    fireEvent,
    waitFor,
    prettyDOM,
    within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import DateController from "../../../Components/DateHandler/DateController";

describe("DateController", () => {
    const mockUpdateHandler = jest.fn();
    const mockUpdateAllDates = jest.fn();
    const mockSetURLSelector = jest.fn();
    test("renders DateController component", () => {
        render(
            <DateController
                dateBuild={{ month: 1, day: 1, year: 2021 }}
                updateHandler={mockUpdateHandler}
                updateAllDates={mockUpdateAllDates}
                setURLSelector={mockSetURLSelector}
            />
        );

        expect(
            screen.getByTestId("date-controller-form-month")
        ).toBeInTheDocument();
        expect(
            screen.getByTestId("date-controller-form-day")
        ).toBeInTheDocument();
        expect(
            screen.getByTestId("date-controller-form-year")
        ).toBeInTheDocument();
        expect(
            screen.getByTestId("date-controller-form-submit")
        ).toBeInTheDocument();
    });

    test("change input values and submit the form", async () => {
        render(
            <DateController
                dateBuild={{ month: 1, day: 1, year: 2021 }}
                updateHandler={mockUpdateHandler}
                updateAllDates={mockUpdateAllDates}
                setURLSelector={mockSetURLSelector}
            />
        );

        fireEvent.change(screen.getByTestId("date-controller-form-month"), {
            target: { value: "5" },
        });
        fireEvent.change(screen.getByTestId("date-controller-form-day"), {
            target: { value: "15" },
        });
        fireEvent.change(screen.getByTestId("date-controller-form-year"), {
            target: { value: "2022" },
        });

        fireEvent.click(screen.getByTestId("date-controller-form-submit"));

        await waitFor(() => expect(mockUpdateHandler).toHaveBeenCalledTimes(3));
        await waitFor(() => expect(mockSetURLSelector).toHaveBeenCalled());
    });

    test("Date Fixer is correctly displayed", async () => {
        render(
            <DateController
                dateBuild={{ month: 1, day: 6, year: 2021 }}
                updateHandler={mockUpdateHandler}
                updateAllDates={mockUpdateAllDates}
                setURLSelector={mockSetURLSelector}
            />
        );

        fireEvent.click(screen.getByTestId("date-controller-form-submit"));

        await waitFor(() => {
            expect(screen.getByTestId("date-offers")).toBeInTheDocument();

            const dateOffers = screen.getByTestId("date-offers");
            const listItems = within(dateOffers).getAllByRole("listitem");

            expect(listItems).toHaveLength(4);
            expect(listItems.map((item) => item.textContent)).toContain(
                "1 - 1 - 2021"
            );
            expect(listItems.map((item) => item.textContent)).toContain(
                "12 - 31 - 2020"
            );
        });

        // Then, you can use `prettyDOM` to log the rendered HTML
    });
});

const Wrapper = () => {
    const [dateBuild, setDateBuild] = useState({
        month: 1,
        day: 1,
        year: 2021,
    });

    const mockUpdateAllDates = (m, d, y) => {
        setDateBuild({
            month: m,
            day: d,
            year: y,
        });
    };

    const mockUpdateHandler = (val, selector) => {
        setDateBuild({
            ...dateBuild,
            [selector]: val,
        });
    };

    const mockSetURLSelector = jest.fn();

    return (
        <DateController
            dateBuild={dateBuild}
            updateHandler={mockUpdateHandler}
            updateAllDates={mockUpdateAllDates}
            setURLSelector={mockSetURLSelector}
        />
    );
};

describe("DateController with wrapper", () => {
    test("change input values and submit the form", async () => {
        render(<Wrapper />);

        fireEvent.change(screen.getByTestId("date-controller-form-month"), {
            target: { value: 5 },
        });
        fireEvent.change(screen.getByTestId("date-controller-form-day"), {
            target: { value: 15 },
        });
        fireEvent.change(screen.getByTestId("date-controller-form-year"), {
            target: { value: 2022 },
        });
        fireEvent.click(screen.getByTestId("date-controller-form-submit"));

        await waitFor(() => {
            expect(screen.getByTestId("date-offers")).toBeInTheDocument();

            const dateOffers = screen.getByTestId("date-offers");
            const listItems = within(dateOffers).getAllByRole("listitem");

            expect(listItems).toHaveLength(4);

            expect(listItems.map((item) => item.textContent)).toContain(
                "5 - 20 - 2022"
            );
            expect(listItems.map((item) => item.textContent)).toContain(
                "4 - 30 - 2022"
            );
        });
    });

    test("form does not submit when day is greater than max", async () => {
        render(<Wrapper />);

        fireEvent.change(screen.getByTestId("date-controller-form-month"), {
            target: { value: "2" },
        });
        fireEvent.change(screen.getByTestId("date-controller-form-day"), {
            target: { value: "30" },
        });
        fireEvent.change(screen.getByTestId("date-controller-form-year"), {
            target: { value: "2021" },
        });

        fireEvent.click(screen.getByTestId("date-controller-form-submit"));

        await waitFor(() => {
            expect(screen.queryByTestId("date-offers")).not.toBeInTheDocument();
        });
    });

    test("form does not submit when day is greater than max for leap year", async () => {
        render(<Wrapper />);

        fireEvent.change(screen.getByTestId("date-controller-form-month"), {
            target: { value: "2" },
        });
        fireEvent.change(screen.getByTestId("date-controller-form-day"), {
            target: { value: "29" },
        });
        fireEvent.change(screen.getByTestId("date-controller-form-year"), {
            target: { value: "2021" },
        });

        fireEvent.click(screen.getByTestId("date-controller-form-submit"));

        await waitFor(() => {
            expect(screen.queryByTestId("date-offers")).not.toBeInTheDocument();
        });
    });

    test("clicking on an offer in dateOffers updates the dates", async () => {
        render(<Wrapper />);

        fireEvent.change(screen.getByTestId("date-controller-form-month"), {
            target: { value: "2" },
        });
        fireEvent.change(screen.getByTestId("date-controller-form-day"), {
            target: { value: "4" },
        });
        fireEvent.change(screen.getByTestId("date-controller-form-year"), {
            target: { value: "2021" },
        });

        fireEvent.click(screen.getByTestId("date-controller-form-submit"));

        await waitFor(() => {
            const dateOffers = screen.getByTestId("date-offers");
            const listItems = within(dateOffers).getAllByRole("listitem");

            expect(listItems).toHaveLength(4);
        });

        fireEvent.click(screen.getByTestId("monthly-offering-2"));

        await waitFor(() => {
            expect(screen.queryByTestId("date-offers")).not.toBeInTheDocument();
            expect(screen.getByTestId("date-controller-form-month").value === 28);
        });
    });
});
