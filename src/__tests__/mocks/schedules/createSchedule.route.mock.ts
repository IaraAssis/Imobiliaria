export default {
  schedulesComplete: {
    date: '2022/03/01',
    hour: '12:30',
  },
  schedulesRealEstateInvalidID: {
    date: '2022/03/01',
    hour: '12:30',
    realEstateId: 123456,
  },
  schedulesUnique: {
    date: '2022/03/01',
    hour: '12:30',
  },
  schedulesSameDateDifferentRealEstate: {
    date: '2022/03/01',
    hour: '12:30',
  },
  schedulesBefore8AM: {
    date: '2022/03/01',
    hour: '05:00',
  },
  schedulesAfter18PM: {
    date: '2022/03/01',
    hour: '19:00',
  },
  schedulesInvalidDate: {
    date: '2022/01/01',
    hour: '12:30',
  },
  schedulesInvalidBody: {
    date: 12345,
    hour: [],
    realEstateId: '12345',
  },
  schedulesInvalidBody2: {
    ignore_this_key: 'ignore essa chave',
  },
};
