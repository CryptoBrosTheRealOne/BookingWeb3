import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, useDisclosure } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './date.css';

export const getDateRange = (startDate, endDate) => {
    const dates = [];
    let currentDate = startDate;
    while (currentDate <= endDate) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
};

const BookModal = ({ isOpen, onClose, bookHandler, bookedPeriods }) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [periods, setPeriods] = useState([])

    useEffect(() => {
        if (bookedPeriods) {
            setPeriods(bookedPeriods.flatMap(period =>
                getDateRange(new Date(parseInt(period.startDate.toString()) * 1000), new Date(parseInt(period.endDate.toString()) * 1000))
            ))
        }
    }, [bookedPeriods])

    const handleDateChange = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
    };

    
    const clickHandler = async () => {
        let start = Math.floor(startDate.getTime() / 1000);
        let end = start;
        if (endDate != null) {
            end = Math.floor(endDate.getTime() / 1000);
        }

        await bookHandler(start, end)
        setStartDate(null)
        setEndDate(null)
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Book property</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <h2>Select a available period</h2>
                    <DatePicker
                        selected={startDate}
                        onChange={handleDateChange}
                        startDate={startDate}
                        endDate={endDate}
                        selectsRange
                        inline
                        dateFormat="MMMM d, yyyy"
                        highlightDates={periods}
                        excludeDates={periods} // This line disables selection of the dates
                    />
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={clickHandler}>
                        Book
                    </Button>
                    <Button variant='ghost' onClick={onClose}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default BookModal