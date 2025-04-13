-- MariaDB dump 10.19  Distrib 10.11.11-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: 127.0.0.1    Database: lending_statistics
-- ------------------------------------------------------
-- Server version	11.0.3-MariaDB-1:11.0.3+maria~ubu2204

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bank_account_entity`
--

DROP TABLE IF EXISTS `bank_account_entity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `bank_account_entity` (
  `id` uuid NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `personId` uuid NOT NULL,
  `accountIban` varchar(255) NOT NULL,
  `balance` decimal(22,2) NOT NULL,
  `balanceUpdatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `iban-idx` (`accountIban`),
  KEY `balance-update-idx` (`balanceUpdatedAt`),
  KEY `FK_b59bb78bdaa57b011ff3905fb8a` (`personId`),
  CONSTRAINT `FK_b59bb78bdaa57b011ff3905fb8a` FOREIGN KEY (`personId`) REFERENCES `person_entity` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bank_account_entity`
--

LOCK TABLES `bank_account_entity` WRITE;
/*!40000 ALTER TABLE `bank_account_entity` DISABLE KEYS */;
INSERT INTO `bank_account_entity` VALUES
('17ab7d41-7f95-46f5-8f31-36d220e1abbb','2025-04-14 00:54:36','2025-04-14 00:54:36','1581fb18-a3a3-4b8e-a8f8-4d92a61aa913','PS51P303701363915070894010003',50.00,'2023-10-01 02:00:00'),
('8b2ba462-cbc2-41ef-b459-53d49e29c3f4','2025-04-14 00:54:36','2025-04-14 00:54:36','57e6614e-ef20-4b8b-96c4-183317682047','IT86H0647451991JLH6W435423E',400.00,'2023-10-01 02:00:00'),
('8e4130c7-0859-4f7a-8bfd-8b705854a904','2025-04-14 00:54:36','2025-04-14 00:54:36','1581fb18-a3a3-4b8e-a8f8-4d92a61aa913','SE7207590059570050543007',1000.00,'2023-10-01 02:00:00'),
('ae1f9e10-b304-4dc9-a5e4-92de7e5554a0','2025-04-14 00:54:36','2025-04-14 00:54:36','57e6614e-ef20-4b8b-96c4-183317682047','FO2902976789040026',300.00,'2023-10-01 02:00:00'),
('6d4290fb-b44c-4bfe-9af5-986636be14fe','2025-04-14 00:54:36','2025-04-14 00:54:36','57e6614e-ef20-4b8b-96c4-183317682047','CH090008809568552L288',600.00,'2023-10-01 02:00:00'),
('77a39aad-2438-4469-8e46-d3d45b8ae532','2025-04-14 00:54:36','2025-04-14 00:54:36','1b7c00d6-9175-4ed6-a284-f964006527aa','MK823964149228O7651',3000.00,'2023-10-01 02:00:00');
/*!40000 ALTER TABLE `bank_account_entity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `friendship_entity`
--

DROP TABLE IF EXISTS `friendship_entity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `friendship_entity` (
  `personAId` uuid NOT NULL,
  `personBId` uuid NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`personAId`,`personBId`),
  KEY `FK_1279c25ca6fe5460de721d7b58b` (`personBId`),
  CONSTRAINT `FK_1279c25ca6fe5460de721d7b58b` FOREIGN KEY (`personBId`) REFERENCES `person_entity` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_424102049cbc4b7d18925184f92` FOREIGN KEY (`personAId`) REFERENCES `person_entity` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `friendship_entity`
--

LOCK TABLES `friendship_entity` WRITE;
/*!40000 ALTER TABLE `friendship_entity` DISABLE KEYS */;
INSERT INTO `friendship_entity` VALUES
('57e6614e-ef20-4b8b-96c4-183317682047','1581fb18-a3a3-4b8e-a8f8-4d92a61aa913','2025-04-14 00:54:36','2025-04-14 00:54:36'),
('57e6614e-ef20-4b8b-96c4-183317682047','1b7c00d6-9175-4ed6-a284-f964006527aa','2025-04-14 00:54:36','2025-04-14 00:54:36'),
('1581fb18-a3a3-4b8e-a8f8-4d92a61aa913','57e6614e-ef20-4b8b-96c4-183317682047','2025-04-14 00:54:36','2025-04-14 00:54:36'),
('1581fb18-a3a3-4b8e-a8f8-4d92a61aa913','1b7c00d6-9175-4ed6-a284-f964006527aa','2025-04-14 00:54:36','2025-04-14 00:54:36'),
('1b7c00d6-9175-4ed6-a284-f964006527aa','57e6614e-ef20-4b8b-96c4-183317682047','2025-04-14 00:54:36','2025-04-14 00:54:36'),
('1b7c00d6-9175-4ed6-a284-f964006527aa','1581fb18-a3a3-4b8e-a8f8-4d92a61aa913','2025-04-14 00:54:36','2025-04-14 00:54:36');
/*!40000 ALTER TABLE `friendship_entity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `person_entity`
--

DROP TABLE IF EXISTS `person_entity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `person_entity` (
  `id` uuid NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `person_entity`
--

LOCK TABLES `person_entity` WRITE;
/*!40000 ALTER TABLE `person_entity` DISABLE KEYS */;
INSERT INTO `person_entity` VALUES
('57e6614e-ef20-4b8b-96c4-183317682047','2025-04-14 00:54:36','2025-04-14 00:54:36','Jason Walker','Rubie.Schumm@yahoo.com'),
('1581fb18-a3a3-4b8e-a8f8-4d92a61aa913','2025-04-14 00:54:36','2025-04-14 00:54:36','Roland Thompson','Aurore13@yahoo.com'),
('1b7c00d6-9175-4ed6-a284-f964006527aa','2025-04-14 00:54:36','2025-04-14 00:54:36','Mr. Sidney Keebler','Katrina.Dietrich55@hotmail.com');
/*!40000 ALTER TABLE `person_entity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `person_loan_limit_entity`
--

DROP TABLE IF EXISTS `person_loan_limit_entity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `person_loan_limit_entity` (
  `id` uuid NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `personId` uuid NOT NULL,
  `friendId` uuid NOT NULL,
  `limit` decimal(22,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_330de553275c5450eca6f0ac582` (`personId`),
  KEY `FK_bdad1cc94a469b0c9da28f66bdb` (`friendId`),
  CONSTRAINT `FK_330de553275c5450eca6f0ac582` FOREIGN KEY (`personId`) REFERENCES `person_entity` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_bdad1cc94a469b0c9da28f66bdb` FOREIGN KEY (`friendId`) REFERENCES `person_entity` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `person_loan_limit_entity`
--

LOCK TABLES `person_loan_limit_entity` WRITE;
/*!40000 ALTER TABLE `person_loan_limit_entity` DISABLE KEYS */;
/*!40000 ALTER TABLE `person_loan_limit_entity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `person_wealth_info_entity`
--

DROP TABLE IF EXISTS `person_wealth_info_entity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `person_wealth_info_entity` (
  `id` uuid NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `personId` uuid NOT NULL,
  `totalBalance` decimal(22,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_68ad7beeaac9de52e9d868aa510` (`personId`),
  CONSTRAINT `FK_68ad7beeaac9de52e9d868aa510` FOREIGN KEY (`personId`) REFERENCES `person_entity` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `person_wealth_info_entity`
--

LOCK TABLES `person_wealth_info_entity` WRITE;
/*!40000 ALTER TABLE `person_wealth_info_entity` DISABLE KEYS */;
/*!40000 ALTER TABLE `person_wealth_info_entity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transaction_entity`
--

DROP TABLE IF EXISTS `transaction_entity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaction_entity` (
  `id` uuid NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `fromIban` varchar(255) NOT NULL,
  `toIban` varchar(255) NOT NULL,
  `amount` decimal(22,2) NOT NULL,
  `transactionDate` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `from-iban-idx` (`fromIban`),
  KEY `to-iban-idx` (`toIban`),
  KEY `transaction-date-idx` (`transactionDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaction_entity`
--

LOCK TABLES `transaction_entity` WRITE;
/*!40000 ALTER TABLE `transaction_entity` DISABLE KEYS */;
INSERT INTO `transaction_entity` VALUES
('73038813-fcaa-4456-a8cd-6443028b1f19','2025-04-14 00:54:36','2025-04-14 00:54:36','FO2902976789040026','PS51P303701363915070894010003',50.00,'2023-11-01 01:00:00'),
('da0b3386-8843-48a8-ab3e-6c10236869d4','2025-04-14 00:54:36','2025-04-14 00:54:36','FO2902976789040026','DE-123456789012345',350.00,'2023-11-01 01:00:00'),
('458b0721-e802-4774-83eb-7e0e2053aa35','2025-04-14 00:54:36','2025-04-14 00:54:36','PS51P303701363915070894010003','FO2902976789040026',3.89,'2023-11-01 01:00:00'),
('1c9973b4-475a-4ca8-9b2c-91c97c046678','2025-04-14 00:54:36','2025-04-14 00:54:36','SE7207590059570050543007','PS51P303701363915070894010003',9.99,'2023-11-01 01:00:00'),
('a68c8ddd-e936-420e-8b41-c70841071126','2025-04-14 00:54:36','2025-04-14 00:54:36','DE-123456789012345','FO2902976789040026',500.00,'2023-11-01 01:00:00'),
('5ab7be89-3d9d-4de7-9574-e852b1a95815','2025-04-14 00:54:36','2025-04-14 00:54:36','PS51P303701363915070894010003','FO2902976789040026',4.99,'2023-11-01 01:00:00'),
('16da8355-a27b-48b1-8055-fe36f5c50b87','2025-04-14 00:54:36','2025-04-14 00:54:36','SE7207590059570050543007','FO2902976789040026',500.00,'2023-11-01 01:00:00');
/*!40000 ALTER TABLE `transaction_entity` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-14  0:56:33
