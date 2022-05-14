var archiveRecord = new Record();

var config = {
    tableUrl: 'regressAuditorRecord/selectRegressAuditByFkAuditorId',
    pageCode: 'archive-manage',
    export: 'regressAuditorRecord/export',
    detailsUrl: 'regressAuditorRecord/selectDetail'
};

archiveRecord.checkRecord(config);