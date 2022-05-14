var archiveRecord = new Record();

var config = {
    tableUrl: 'borrowAuditorRecord/selectBorrowAuditByFkAuditorId',
    pageCode: 'borrow-run',
    export: 'borrowAuditorRecord/export',
    detailsUrl: 'borrowAuditorRecord/selectDetail'
};

archiveRecord.checkRecord(config);