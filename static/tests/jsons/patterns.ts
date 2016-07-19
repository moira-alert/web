var sp = "&nbsp;&nbsp;&nbsp;&nbsp;";
var nl = "<br/>";

export var patterns = [
  {
    in: 'KE.system.{Abonents,Auth,Crypt,Docflow,Drive,Echelon,FT,Highlander,Kanso,Keweb,KeLiteNewsIndex,LiveIndexes,Portal,Pservice,Print,Pfr}.*.volumes.*.freemegabytes',
    out: 'KE.system.{Abonents,Auth,Crypt,Docflow,Drive,Echelon,FT,Highlander,Kanso,Keweb,KeLiteNewsIndex,LiveIndexes,Portal,Pservice,Print,Pfr}.*.volumes.*.freemegabytes'
  },
  {
    in: 'aliasByNode(service-pinger.status.topology.{CUs,abonents,abonentsCache,abonentsService,api-Requisites,api-auth,api-classification,api-drive,api-echelon-forms,api-echelon-print,api-echelon-rpn,api-echelon-sicklist,api-highlander-webapi,api-kanso-3d-sys-msk,api-picklist,api-portal-authorizator,api-portal-certificates,api-portal-requisites,api-uploadService,api-warrant,authService,banana-master,candyforms,certVerifier,certcheck,certificates-buscador,certificates-rest,certs,cloudcrypt,contactServer,contacts,contracts-buscador,dictionaries,docflow,emailservice,errorservice,excel-print_server,fop-print_server,groups,groupsprops,groupsservice,highlander,notifications,notifications-service,numpools,permissions,permissionsWriter,portal-certificates-buscador,portal-requisites-buscador-orggroups,portal-requisites-buscador-orgs,portal-requisites-buscador-usergroups,portal-requisites-buscador-users,predictor,print_servers,props,props_search,propssearch-base,queue-service,requisites,rpn-keOrganisations-service,rpn-xml-service,scansbuscador,settings-service,trels-index,trels-service,users-buscador,users-service,zebra,zookeeper}.cluster.*.replica.*.degradation-percent, 3, 5, 7)',
    out: 'aliasByNode(' + nl +
            sp + 'service-pinger.status.topology.{CUs,abonents,abonentsCache,abonentsService,api-Requisites,api-auth,api-classification,api-drive,api-echelon-forms,api-echelon-print,api-echelon-rpn,api-echelon-sicklist,api-highlander-webapi,api-kanso-3d-sys-msk,api-picklist,api-portal-authorizator,api-portal-certificates,api-portal-requisites,api-uploadService,api-warrant,authService,banana-master,candyforms,certVerifier,certcheck,certificates-buscador,certificates-rest,certs,cloudcrypt,contactServer,contacts,contracts-buscador,dictionaries,docflow,emailservice,errorservice,excel-print_server,fop-print_server,groups,groupsprops,groupsservice,highlander,notifications,notifications-service,numpools,permissions,permissionsWriter,portal-certificates-buscador,portal-requisites-buscador-orggroups,portal-requisites-buscador-orgs,portal-requisites-buscador-usergroups,portal-requisites-buscador-users,predictor,print_servers,props,props_search,propssearch-base,queue-service,requisites,rpn-keOrganisations-service,rpn-xml-service,scansbuscador,settings-service,trels-index,trels-service,users-buscador,users-service,zebra,zookeeper}.cluster.*.replica.*.degradation-percent,' + nl +
            sp + '3, 5, 7)'
  },
  {
    in: 'KE.system.{Abonents,Auth,Crypt,Docflow,Drive,Echelon,FT,Highlander,Kanso,Keweb,KeLiteNewsIndex,LiveIndexes,Portal,Pservice,Pfr}.*.cpu.usage',
    out: 'KE.system.{Abonents,Auth,Crypt,Docflow,Drive,Echelon,FT,Highlander,Kanso,Keweb,KeLiteNewsIndex,LiveIndexes,Portal,Pservice,Pfr}.*.cpu.usage'
  },
  {
    in: 'aliasByNode(service-pinger.status.topology.*.cluster.*.degradation-percent, 3, 5)',
    out: 'aliasByNode(' + nl +
            sp + 'service-pinger.status.topology.*.cluster.*.degradation-percent,' + nl +
            sp + '3, 5)'
  },
  {
    in: "aliasByNode(exclude(sortByMaxima(currentBelow(KE.Databases.BackupAge.*.Full.Minutes, 1000000000)), '(_tmp|_temp|_bak|_copy|_test|aspstate)'), 3)",
    out: 'aliasByNode(' + nl +
            sp + 'exclude(' + nl +
            sp + sp + 'sortByMaxima(' + nl +
            sp + sp + sp + 'currentBelow(' + nl +
            sp + sp + sp + sp + 'KE.Databases.BackupAge.*.Full.Minutes,' + nl +
            sp + sp + sp + sp + '1000000000)),' + nl +
            sp + sp + "'(_tmp|_temp|_bak|_copy|_test|aspstate)')," + nl +
            sp + '3)'
  },
  {
    in: 'KE.system.{Abonents,Auth,Drive,Echelon,FT,Highlander,Kanso,Keweb,Portal,Pservice}.*.mem.availablembytes',
    out: 'KE.system.{Abonents,Auth,Drive,Echelon,FT,Highlander,Kanso,Keweb,Portal,Pservice}.*.mem.availablembytes'
  },
  {
    in: 'OFD.Staging.ofd-cashboxdocuments-indexer.cassandra-timeline-reader.ofd-cashboxdocuments-indexer.*.latency.Last-ms',
    out: 'OFD.Staging.ofd-cashboxdocuments-indexer.cassandra-timeline-reader.ofd-cashboxdocuments-indexer.*.latency.Last-ms'
  },
  {
    in: 'KE.system.app22*.ram_mb_free',
    out: 'KE.system.app22*.ram_mb_free'
  },
  {
    in: 'aliasByNode(KE.echelon.queue.ready.avg.oftype.*, 6, 3)',
    out: 'aliasByNode(' + nl +
            sp + 'KE.echelon.queue.ready.avg.oftype.*,' + nl +
            sp + '6, 3)'
  },
  {
    in: "aliasByNode(movingAverage(service-pinger.status.topology.*.cluster.*.degradation-percent,'5min','min'), 3, 5)",
    out: 'aliasByNode(' + nl +
            sp + 'movingAverage(' + nl +
            sp + sp + 'service-pinger.status.topology.*.cluster.*.degradation-percent,' + nl +
            sp + sp + "'5min'," + nl +
            sp + sp + "'min')," + nl +
            sp + '3, 5)'
  },
  {
    in: 'sumSeries(derivative(KE.Highlander-webapi.*.AfterThrottling.anyAction.status.status.4*.Count-Requests))',
    out: 'sumSeries(' + nl +
            sp + 'derivative(' + nl +
            sp + sp + 'KE.Highlander-webapi.*.AfterThrottling.anyAction.status.status.4*.Count-Requests))'
  },
  {
    in: "aliasSub(aliasByNode(scale(Connector.DCEdiDaemon.*.DCEdiDaemonexe.Queue_EdiMapper.time_from_last_published_task, 0.001), 2), '(.+)', '\\1 idle time (seconds)')",
    out: 'aliasSub(' + nl +
            sp + 'aliasByNode(' + nl +
            sp + sp + 'scale(' + nl +
            sp + sp + sp + 'Connector.DCEdiDaemon.*.DCEdiDaemonexe.Queue_EdiMapper.time_from_last_published_task,' + nl +
            sp + sp + sp + '0.001),' + nl +
            sp + sp + '2),' + nl +
            sp + "'(.+)'," + nl +
            sp + "'\\1 idle time (seconds)')"
  },
  {
    in: 'KE.payments.*.BanksController.persecond.notfound',
    out: 'KE.payments.*.BanksController.persecond.notfound'
  },
  {
    in: "movingAverage(KE.liveindex.requests.p95.*.*, '1min')",
    out: 'movingAverage(' + nl +
            sp + 'KE.liveindex.requests.p95.*.*,' + nl +
            sp + "'1min')"
  },
  {
    in: "aliasByNode(movingAverage(DevOps.moira.*.checker.time.*.*, '30min'), 2, 6)",
    out: 'aliasByNode(' + nl +
            sp + 'movingAverage(' + nl +
            sp + sp + 'DevOps.moira.*.checker.time.*.*,' + nl +
            sp + sp + "'30min')," + nl +
            sp + '2, 6)'

  },
  {
    in: "movingAverage(KLADR.nginx.*.upstream_response_time.total.p95, '10min')",
    out: 'movingAverage(' + nl +
            sp + 'KLADR.nginx.*.upstream_response_time.total.p95,' + nl +
            sp + "'10min')"
  },
  {
    in: "alias(sumSeries(KE.dc-api.*.responsecode.4*.count, 4xx), '4xx')",
    out: 'alias(' + nl +
            sp + 'sumSeries(' + nl +
            sp + sp + 'KE.dc-api.*.responsecode.4*.count,' + nl +
            sp + sp + '4xx),' + nl +
            sp + "'4xx')"
  },

  {
    in: "sumSeries(derivative(KE.Highlander-webapi.*.AfterThrottling.anyAction.status.status.503.Count-Requests))",
    out: 'sumSeries(' + nl +
            sp + 'derivative(' + nl +
            sp + sp + 'KE.Highlander-webapi.*.AfterThrottling.anyAction.status.status.503.Count-Requests))'
  }

];
