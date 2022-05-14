/*
 Navicat Premium Data Transfer

 Source Server         : local
 Source Server Type    : MySQL
 Source Server Version : 50726
 Source Host           : 192.168.2.156:3306
 Source Schema         : easyexceltest

 Target Server Type    : MySQL
 Target Server Version : 50726
 File Encoding         : 65001

 Date: 14/05/2022 16:13:11
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for stu
-- ----------------------------
DROP TABLE IF EXISTS `stu`;
CREATE TABLE `stu`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `sex` int(4) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `classid` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `score` float(10, 2) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 46 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of stu
-- ----------------------------
INSERT INTO `stu` VALUES (1, '张三', 0, 18, '3班', 72.23);
INSERT INTO `stu` VALUES (2, '李四', 1, 19, '1班', 85.50);
INSERT INTO `stu` VALUES (3, '王五', 0, 20, '2班', 86.36);
INSERT INTO `stu` VALUES (26, 'name= 0', 0, 0, '3班', 90.50);
INSERT INTO `stu` VALUES (27, 'name= 1', 1, 1, '3班', 91.50);
INSERT INTO `stu` VALUES (28, 'name= 2', 0, 2, '3班', 92.50);
INSERT INTO `stu` VALUES (29, 'name= 3', 1, 3, '3班', 93.50);
INSERT INTO `stu` VALUES (30, 'name= 4', 0, 4, '3班', 94.50);
INSERT INTO `stu` VALUES (31, 'name= 5', 1, 5, '3班', 95.50);
INSERT INTO `stu` VALUES (32, 'name= 6', 0, 6, '3班', 96.50);
INSERT INTO `stu` VALUES (33, 'name= 7', 1, 7, '3班', 97.50);
INSERT INTO `stu` VALUES (34, 'name= 8', 0, 8, '3班', 98.50);
INSERT INTO `stu` VALUES (35, 'name= 9', 1, 9, '3班', 99.50);
INSERT INTO `stu` VALUES (36, 'name= 10', 0, 10, '3班', 100.50);
INSERT INTO `stu` VALUES (40, '张三', 0, 18, '3班', 72.23);
INSERT INTO `stu` VALUES (41, '李四', 1, 19, '1班', 85.50);
INSERT INTO `stu` VALUES (42, '王五', 0, 20, '2班', 86.36);
INSERT INTO `stu` VALUES (43, '张三', 0, 18, '3班', 72.23);
INSERT INTO `stu` VALUES (44, '李四', 1, 19, '1班', 85.50);
INSERT INTO `stu` VALUES (45, '王五', 0, 20, '2班', 86.36);

SET FOREIGN_KEY_CHECKS = 1;
