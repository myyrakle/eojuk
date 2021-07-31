CREATE TABLE action (
  `id` int NOT NULL AUTO_INCREMENT,
  `platform` enum('IOS','ANDROID','PC_WEB','MOBILE_WEB','ETC') NOT NULL DEFAULT 'PC_WEB',
  `date` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_11db75ea5697b4c806aedc0739` (`type`),
  KEY `IDX_2820136a62f5ae380b8d76f9dc` (`itemId`),
  KEY `IDX_51c78f7dbdc63cdfb816e74aab` (`date`)
);