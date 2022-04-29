import Agenda from "agenda";

const agenda = new Agenda({
  db: {
    //TODO will replace with actuall DB address
    address: "mongodb address",
    collection: 'agendaJobs', //TODO have to replace this collection
  },
  maxConcurrency: 20,
});

// listen for the ready or error event.
agenda
  .on('ready', () => console.log("Agenda started!"))
  .on('error', () => console.log("Agenda connection error!"));

// define all agenda jobs
/**
 * @info Here we are defining all agenda jobs based on our use cases.
 */
agenda.define("schedule a one time transaction", async (job, done) => {
  const { data } = job.attrs;
  //TODO  have to add the logic for a scheduled transaction
  console.log(data)
  done();
});

agenda.define("perform an instant transaction", async (job, done) => {
  const { data } = job.attrs;
  //TODO  have to add the logic for instant transaction
  console.log(data);
  done();
});

agenda.define("schedule recurring transactions", async (job, done) => {
  const { data } = job.attrs;
  //TODO  have to add the logic for recurring transactions
  console.log(data);
  done();
});


// logs all registered jobs 
console.log({ jobs: agenda._definitions });

export { agenda }