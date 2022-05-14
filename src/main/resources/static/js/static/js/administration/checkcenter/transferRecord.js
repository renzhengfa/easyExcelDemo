var archiveRecord = new Record();

var config = {
    tableUrl: 'transferAuditorRecord/selectTransferAuditByFkAuditorId',
    pageCode: 'transfer-manage',
    export: 'transferAuditorRecord/export',
    detailsUrl: 'transferAuditorRecord/selectDetail'
};

archiveRecord.checkRecord(config);