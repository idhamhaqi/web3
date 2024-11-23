-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: zuxton
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `node_sessions`
--

DROP TABLE IF EXISTS `node_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `node_sessions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `start_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `end_time` timestamp NULL DEFAULT NULL,
  `status` enum('running','stopped') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'running',
  `points_earned` decimal(10,2) DEFAULT '0.00',
  `nodes_validated` int DEFAULT '0',
  `total_hours` decimal(10,2) DEFAULT '0.00',
  PRIMARY KEY (`id`),
  KEY `idx_user_status` (`user_id`,`status`),
  KEY `idx_start_time` (`start_time`),
  CONSTRAINT `node_sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `node_sessions`
--

LOCK TABLES `node_sessions` WRITE;
/*!40000 ALTER TABLE `node_sessions` DISABLE KEYS */;
INSERT INTO `node_sessions` VALUES (1,1,'2024-11-14 00:50:49','2024-11-15 11:21:28','stopped',102.30,511,34.51),(2,3,'2024-11-14 00:57:39','2024-11-14 11:53:51','stopped',196.10,975,10.94),(3,1,'2024-11-16 15:08:03','2024-11-16 17:00:43','stopped',25.50,130,1.88),(4,1,'2024-11-16 23:59:44','2024-11-17 00:58:46','stopped',17.30,87,0.98),(5,1,'2024-11-17 07:39:48','2024-11-17 10:11:43','stopped',44.50,226,2.53),(6,1,'2024-11-17 11:17:55','2024-11-17 17:00:02','stopped',104.40,507,5.70),(7,1,'2024-11-17 22:45:12','2024-11-18 00:37:42','stopped',20.40,102,1.88),(8,1,'2024-11-18 00:38:36','2024-11-18 00:45:01','stopped',1.60,8,0.11),(9,1,'2024-11-18 01:03:09','2024-11-18 01:31:59','stopped',8.30,46,0.48),(10,1,'2024-11-18 05:36:01','2024-11-18 05:37:32','stopped',0.40,2,0.03),(11,1,'2024-11-18 07:30:02','2024-11-18 21:17:44','stopped',99.70,499,13.80),(12,1,'2024-11-18 21:35:39','2024-11-18 22:02:10','stopped',8.70,42,0.44),(13,1,'2024-11-18 22:02:29','2024-11-19 02:05:47','stopped',64.00,324,4.06),(14,1,'2024-11-19 02:08:20','2024-11-19 02:08:23','stopped',0.00,0,0.00),(15,1,'2024-11-19 05:22:24','2024-11-19 05:26:08','stopped',0.90,4,0.06),(16,1,'2024-11-19 05:30:05','2024-11-19 11:48:45','stopped',111.70,568,6.31),(17,1,'2024-11-19 11:59:24','2024-11-19 11:59:31','stopped',0.00,0,0.00),(18,1,'2024-11-19 22:35:27','2024-11-20 17:00:31','stopped',336.90,1665,18.42),(19,1,'2024-11-20 21:48:47','2024-11-20 22:50:17','stopped',18.10,91,1.03),(20,1,'2024-11-20 23:42:48','2024-11-21 05:14:54','stopped',100.10,498,5.54),(21,1,'2024-11-21 06:16:15','2024-11-21 06:19:33','stopped',0.80,4,0.06),(22,1,'2024-11-21 06:56:56','2024-11-21 17:00:37','stopped',187.20,927,10.06),(23,1,'2024-11-21 22:45:01','2024-11-22 17:00:00','stopped',331.40,1636,18.25),(24,1,'2024-11-22 22:15:19','2024-11-23 00:35:12','stopped',28.90,144,2.33),(25,1,'2024-11-23 00:37:10',NULL,'running',201.00,999,0.00);
/*!40000 ALTER TABLE `node_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `referrals`
--

DROP TABLE IF EXISTS `referrals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `referrals` (
  `id` int NOT NULL AUTO_INCREMENT,
  `referrer_id` int NOT NULL,
  `referred_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `referrer_id` (`referrer_id`),
  KEY `referred_id` (`referred_id`),
  CONSTRAINT `referrals_ibfk_1` FOREIGN KEY (`referrer_id`) REFERENCES `users` (`id`),
  CONSTRAINT `referrals_ibfk_2` FOREIGN KEY (`referred_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `referrals`
--

LOCK TABLES `referrals` WRITE;
/*!40000 ALTER TABLE `referrals` DISABLE KEYS */;
INSERT INTO `referrals` VALUES (1,1,3,'2024-11-10 13:54:18');
/*!40000 ALTER TABLE `referrals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `wallet_address` varchar(255) NOT NULL,
  `referral_code` varchar(10) NOT NULL,
  `referred_by` varchar(10) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `last_login` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `validator_status` tinyint(1) DEFAULT '0',
  `poc_tx_hash` text,
  `poc_timestamp` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `wallet_address` (`wallet_address`),
  UNIQUE KEY `referral_code` (`referral_code`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'0:6719e441ece0529a540cbdbc82adc473a299467f4fcc9e85b62e676d1e0fa8d4','f12bdc6702',NULL,'2024-11-08 10:36:40','2024-11-09 13:04:41',1,'te6cckEBBAEAtwAB5YgAzjPIg9nApTSoGXt5BVuI50UyjP6fmT0LbFzO2jwfUagDm0s7c///+Is5eviYAAAAHSQVHebmGY71tg5EUN++krlMqKWYe5QsfH3/+Z4zeDGk6hpcjmUmymWa+DBkVmtlpKmKeUxxVMKiWVzeN98ncAcBAgoOw8htAwMCAGhCABMHrlAOLQTWNU14f9fW1ILV4B2ej2HOU+ECBTJOd0b+odzWUAAAAAAAAAAAAAAAAAAAAAAFydh0','2024-11-09 13:04:41'),(2,'0:9f74390e2af413f82d7aad9964b938b6f64504bacf2886dd13ba0f9a7d7fb600','279e5f3060',NULL,'2024-11-08 12:48:12','2024-11-10 14:23:54',1,'te6cckEBAgEAqgAB4YgBPuhyHFXoJ/Ba9VsyyXJxbeyKCXWeUQ26J3QfNPr/bAAFnxfp3argJfOxwF1WU5A75fCzvc1KQXLD6XLdtnGWXV0R08Us7uXMCOfmb5LR2JP2W39qD+C2UPb2Hr4MzHKwGU1NGLs5hhGgAAAA8AAcAQBoQgATB65QDi0E1jVNeH/X1tSC1eAdno9hzlPhAgUyTndG/qHc1lAAAAAAAAAAAAAAAAAAADt7qI4=','2024-11-10 14:23:54'),(3,'0:a413e4658d94c8b4c06707f61cf446be76975c312216c52cefeb34f60296cd6c','eb955d85ca','f12bdc6702','2024-11-10 13:54:18','2024-11-10 14:15:49',1,'te6ccgECGwEAA20AAkWIAUgnyMsbKZFpgM4P7DnojXztLrhiRC2KWd/WaewFLZrYHgECAgE0AwQBoXNpZ25///8R/////wAAAACgh+S57hQcev2jLhPobaY9LGgtX8fsjgGUTf1kzEDaBNCATuoSE6lzlbB7vNeb/W47PWtMIw8SxMP48n1ICy7AYBgBFP8A9KQT9LzyyAsFAFGAAAAAP///iJj3TSB+igMtIzHL3bB/Asdp6sRx3l15W2SfunMHabkaIAIBIAYHAgFICAkBAvISAtzQINdJwSCRW49jINcLHyCCEGV4dG69IYIQc2ludL2wkl8D4IIQZXh0brqOtIAg1yEB0HTXIfpAMPpE+Cj6RDBYvZFb4O1E0IEBQdch9AWDB/QOb6ExkTDhgEDXIXB/2zzgMSDXSYECgLmRMOBw4hQTAgEgCgsCASAMDQAZvl8PaiaECAoOuQ+gLAIBbg4PAgFIEBEAGa3OdqJoQCDrkOuF/8AAGa8d9qJoQBDrkOuFj8AAF7Ml+1E0HHXIdcLH4AARsmL7UTQ1woAgAR4g1wsfghBzaWduuvLgin8TAeaO8O2i7fshgwjXIgKDCNcjIIAg1yHTH9Mf0x/tRNDSANMfINMf0//XCgAK+QFAzPkQmiiUXwrbMeHywIffArNQB7Dy0IRRJbry4IVQNrry4Ib4I7vy0IgikvgA3gGkf8jKAMsfAc8Wye1UIJL4D95w2zzYFAP27aLt+wL0BCFukmwhjkwCIdc5MHCUIccAs44tAdcoIHYeQ2wg10nACPLgkyDXSsAC8uCTINcdBscSwgBSMLDy0InXTNc5MAGk6GwShAe78uCT10rAAPLgk+1V4tIAAcAAkVvg69csCBQgkXCWAdcsCBwS4lIQseMPINdKFRYXAJYB+kAB+kT4KPpEMFi68uCR7UTQgQFB1xj0BQSdf8jKAEAEgwf0U/Lgi44UA4MH9Fvy4Iwi1woAIW4Bs7Dy0JDiyFADzxYS9ADJ7VQAcjDXLAgkji0h8uCS0gDtRNDSAFETuvLQj1RQMJExnAGBAUDXIdcKAPLgjuLIygBYzxbJ7VST8sCN4gAQk1vbMeHXTNACCg7DyG0DGRoAAABoYgATB65QDi0E1jVNeH/X1tSC1eAdno9hzlPhAgUyTndG/qHc1lAAAAAAAAAAAAAAAAAAAA==','2024-11-10 14:15:49');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-23 18:33:22
