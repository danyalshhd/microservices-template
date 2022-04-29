import { Request, Response } from 'express';
import { agenda } from '../../utils/agenda';


/**
 * @info This is transaction controller in  this we manage all of our sheduled transactions
 * for line 34 for managing intervalString
 *  # ┌────────────── second (optional)
 # │ ┌──────────── minute
 # │ │ ┌────────── hour
 # │ │ │ ┌──────── day of month
 # │ │ │ │ ┌────── month
 # │ │ │ │ │ ┌──── day of week
 # │ │ │ │ │ │
 # │ │ │ │ │ │
 # * * * * * *
 */


export default async function transactionsController(req: Request, res: Response) {
    try {
        const paymentType = req.body.paymentType;

        if (!paymentType) {
            return res.send('Must pass a jobType in the query params.');
        }

        //TODO Have to add service layer and move all the below logic into service layer
        // Here starting the agenda instance
        await agenda.start();

        if (paymentType === 'instant') {
            await agenda.now('perform an instant transaction', req.body);
        }

        if (paymentType === 'scheduled') {
            //TODO have to manage timings for scheduled transactions
            await agenda.schedule('* * * * *', 'schedule a one time transaction', req.body);
        }

        if (paymentType === 'recurring') {
            // here getting the interval type this could be monthly/weekly/daily
            const intervalType = req.body.intervalType;
            //Look above at the info section for managing this string
            let intervalString = '* * * * * *';

            if (intervalType === 'daily') {
                // example of how we can run daily task at a specific time
                /**
                 * this is an example how we can run a task daily on 12 pm 
                 * '0 0 12 * * *'
                 */

                intervalString = `0 0 ${req.body.selectedHour} * * *`
            }

            //TODO have to change the intervalString for weekly and montly transactions

            await agenda.every(intervalString, 'schedule recurring transactions', req.body);
        }

        return res.status(200).send({
            success: true,
            message: 'Success',
        });

    } catch (error) {
        return res.status(500).send({
            success: false,
            message: 'Failed',
        });
    }
}
