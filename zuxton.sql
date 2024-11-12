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
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `node_sessions`
--

LOCK TABLES `node_sessions` WRITE;
/*!40000 ALTER TABLE `node_sessions` DISABLE KEYS */;
INSERT INTO `node_sessions` VALUES (1,1,'2024-11-10 07:31:16','2024-11-10 07:33:29','stopped',0.00,0,0.00),(2,1,'2024-11-10 07:41:42','2024-11-10 07:41:47','stopped',0.00,0,0.00),(3,1,'2024-11-10 07:45:35','2024-11-10 08:48:25','stopped',0.00,0,1.00),(4,1,'2024-11-10 09:20:58','2024-11-10 09:50:21','stopped',2.90,29,0.00),(5,1,'2024-11-10 09:55:52','2024-11-10 09:58:23','stopped',0.20,2,0.00),(6,1,'2024-11-10 10:09:59','2024-11-10 10:11:02','stopped',0.10,1,0.02),(7,1,'2024-11-10 10:11:38','2024-11-10 10:14:00','stopped',0.20,2,0.04),(8,1,'2024-11-10 10:22:05','2024-11-10 10:24:07','stopped',0.20,2,0.03),(9,1,'2024-11-10 10:31:37','2024-11-10 12:04:32','stopped',8.90,89,1.55),(10,1,'2024-11-10 12:05:04','2024-11-10 21:51:23','stopped',58.10,581,9.77),(11,3,'2024-11-10 14:17:18','2024-11-10 14:50:36','stopped',0.40,4,0.56),(12,2,'2024-11-10 14:24:48','2024-11-10 21:53:50','stopped',2.40,24,7.48),(13,1,'2024-11-10 21:51:41','2024-11-10 22:13:19','stopped',1.80,18,0.36),(14,2,'2024-11-10 21:54:10','2024-11-10 23:49:47','stopped',11.50,115,1.93),(15,1,'2024-11-10 22:13:46','2024-11-10 22:23:30','stopped',0.90,9,0.16),(16,1,'2024-11-10 23:03:15','2024-11-10 23:50:35','stopped',4.70,47,0.79),(17,2,'2024-11-10 23:50:07','2024-11-11 00:08:44','stopped',1.80,18,0.31),(18,1,'2024-11-10 23:51:04','2024-11-11 00:28:17','stopped',3.70,37,0.62),(19,2,'2024-11-11 00:27:56',NULL,'running',1.30,13,0.00),(20,1,'2024-11-11 00:40:23',NULL,'running',0.10,1,0.00);
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

-- Dump completed on 2024-11-11  7:41:33
