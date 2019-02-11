CREATE TABLE `mmsitesc_seatme`.`room` ( 
    `id` INT(3) UNSIGNED NOT NULL AUTO_INCREMENT , 
    `name` VARCHAR(255) NOT NULL ,
    `id_institution` INT(3) UNSIGNED NOT NULL , 
    `name_institution` VARCHAR(255) NOT NULL , 
    `json` VARCHAR(131071) NULL , 
UNIQUE KEY (`id`(3)) 
) ENGINE = MyISAM;

ALTER TABLE `mmsitesc_seatme`.`room` ADD UNIQUE `name` (`name`, `id_institution`) COMMENT '';