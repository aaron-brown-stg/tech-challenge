CREATE TABLE `user` (
    `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
    `name` varchar(100) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

CREATE TABLE `message` (
	`id` int(11) unsigned NOT NULL AUTO_INCREMENT,
	`sender` int(11) unsigned NOT NULL,
	`receiver` int(11) unsigned NOT NULL,
	`body` blob,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;