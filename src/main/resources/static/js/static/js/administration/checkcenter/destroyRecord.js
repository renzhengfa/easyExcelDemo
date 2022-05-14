var archiveRecord = new Record();

var config = {
    tableUrl: 'destroyAuditorRecord/selectDestroyAuditByFkAuditorId',
    pageCode: 'destroy-manage',
    export: 'destroyAuditorRecord/export',
    detailsUrl: 'destroyAuditorRecord/selectDetail'
};

archiveRecord.checkRecord(config);