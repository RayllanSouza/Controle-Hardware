-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 29-Nov-2022 às 19:56
-- Versão do servidor: 10.4.25-MariaDB
-- versão do PHP: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `controledehardware`
--

DELIMITER $$
--
-- Procedimentos
--
CREATE DEFINER=`tecnologia`@`%` PROCEDURE `atualiza estoque` (`id_hard` INT, `qtd_hard` INT, `qtd_compra` INT, `nome_hard` VARCHAR(45))   BEGIN
declare contador int(11) ;
select count(*) into contador FROM 	estoque_hardware where id_hardware = id_hard;  
if contador > 0 then 
update estoque_hardware set qtd_hardware = qtd_hardware + qtd_compra;
else 
insert into estoque_hardware ( id_Hardware, qtd_hardware, data_in_hardware, nome_estoque_Hardware) values (default, qtd_compra, default, nome_hard);
end if;  
END$$

CREATE DEFINER=`tecnologia`@`%` PROCEDURE `atualiza_estoque` (`id_hard` INT, `qtd_hard` INT, `qtd_compra` INT, `nome_hard` VARCHAR(45))   BEGIN
declare contador int(11) ;
select count(*) into contador FROM 	estoque_hardware where id_hardware = id_hard;  
if contador > 0 then 
update estoque_hardware set qtd_hardware = qtd_hardware + qtd_compra;
else 
insert into estoque_hardware ( id_Hardware, qtd_hardware, data_in_hardware, nome_estoque_Hardware) values (default, qtd_compra, default, nome_hard);
end if;  
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estrutura da tabela `estoque_hardware`
--

CREATE TABLE `estoque_hardware` (
  `id_Hardware` int(11) NOT NULL,
  `nome_estoque_Hardware` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `data_in_hardware` date NOT NULL DEFAULT current_timestamp(),
  `qtd_hardware` int(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `hardware`
--

CREATE TABLE `hardware` (
  `codhardware` int(11) NOT NULL,
  `nomehardware` varchar(45) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Extraindo dados da tabela `hardware`
--

INSERT INTO `hardware` (`codhardware`, `nomehardware`) VALUES
(1, 'MOUSE'),
(2, 'TECLADO');

-- --------------------------------------------------------

--
-- Estrutura da tabela `operacao`
--

CREATE TABLE `operacao` (
  `codoperacao` int(11) NOT NULL,
  `nomeoperacao` varchar(45) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Extraindo dados da tabela `operacao`
--

INSERT INTO `operacao` (`codoperacao`, `nomeoperacao`) VALUES
(1, 'VIVO'),
(2, 'CLARO'),
(3, 'AGI'),
(4, 'CREA');

-- --------------------------------------------------------

--
-- Estrutura da tabela `tecnico`
--

CREATE TABLE `tecnico` (
  `codtecnico` int(11) NOT NULL,
  `nometecnico` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `usertecnico` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `senhatecnico` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `admin` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Extraindo dados da tabela `tecnico`
--

INSERT INTO `tecnico` (`codtecnico`, `nometecnico`, `usertecnico`, `senhatecnico`, `admin`) VALUES
(3, 'Luan Charles', 'lcharles', '$2b$10$hjalfn6JeCwOwaMMfHT5Pu8w1VG7BK.Q..FaV8VkFTvr/I4niaB1y', 0),
(4, 'Francisco Crispim', 'fcrispim', '$2b$10$MouFvKHSP9TXZYQaFkMvVOLWEVeKVAuZxnhr1uICkIEQDpk4nQidm', 0),
(5, 'Michel Santos Souza', 'mssouza', '$2b$10$A4x04HIlucAdzFKRx9woa.F8EMM.k6PlBqG12BQPpMVKq8/.QQ05W', 1),
(6, 'Quelson Leão', 'qleao', '$2b$10$rCgWsScyTwSPXByDnlCov.9YC01rrUHe3Y/i53hzIR9.HQLW6Z9ve', 1),
(7, 'Emerson', 'ereis', '$2b$10$JLyMdyC/5qo5xRoRgpLu/e7iliblXxh7ta8ZYLuO3SRaM9T4GQMPa', 0);

-- --------------------------------------------------------

--
-- Estrutura da tabela `tecnico_operacao_hardware`
--

CREATE TABLE `tecnico_operacao_hardware` (
  `codtecnico` int(11) NOT NULL,
  `codoperacao` int(11) NOT NULL,
  `codhardware` int(11) DEFAULT NULL,
  `num_chamado` decimal(10,0) NOT NULL,
  `data_chamado` date DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Extraindo dados da tabela `tecnico_operacao_hardware`
--

INSERT INTO `tecnico_operacao_hardware` (`codtecnico`, `codoperacao`, `codhardware`, `num_chamado`, `data_chamado`) VALUES
(6, 1, 1, '22240', '2022-11-11'),
(6, 4, 1, '22241', '2022-11-11'),
(6, 4, 1, '22242', '2022-11-11'),
(6, 4, 1, '22244', '2022-11-11'),
(6, 4, 1, '22245', '2022-11-11'),
(6, 4, 1, '22247', '2022-11-11'),
(6, 4, 2, '22250', '2022-11-11'),
(6, 4, 2, '22251', '2022-11-11'),
(6, 4, 2, '22252', '2022-11-11'),
(6, 1, 1, '23240', '2022-11-11'),
(6, 1, 1, '24240', '2022-11-11'),
(6, 1, 1, '25240', '2022-11-11'),
(6, 4, 2, '55555', '2022-11-10');

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `estoque_hardware`
--
ALTER TABLE `estoque_hardware`
  ADD PRIMARY KEY (`id_Hardware`);

--
-- Índices para tabela `hardware`
--
ALTER TABLE `hardware`
  ADD PRIMARY KEY (`codhardware`);

--
-- Índices para tabela `operacao`
--
ALTER TABLE `operacao`
  ADD PRIMARY KEY (`codoperacao`);

--
-- Índices para tabela `tecnico`
--
ALTER TABLE `tecnico`
  ADD PRIMARY KEY (`codtecnico`);

--
-- Índices para tabela `tecnico_operacao_hardware`
--
ALTER TABLE `tecnico_operacao_hardware`
  ADD PRIMARY KEY (`num_chamado`),
  ADD KEY `codtecnico_idx` (`codtecnico`),
  ADD KEY `codoperacao_idx` (`codoperacao`),
  ADD KEY `codhardware_idx` (`codhardware`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `estoque_hardware`
--
ALTER TABLE `estoque_hardware`
  MODIFY `id_Hardware` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `hardware`
--
ALTER TABLE `hardware`
  MODIFY `codhardware` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `operacao`
--
ALTER TABLE `operacao`
  MODIFY `codoperacao` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de tabela `tecnico`
--
ALTER TABLE `tecnico`
  MODIFY `codtecnico` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Restrições para despejos de tabelas
--

--
-- Limitadores para a tabela `tecnico_operacao_hardware`
--
ALTER TABLE `tecnico_operacao_hardware`
  ADD CONSTRAINT `codhardware` FOREIGN KEY (`codhardware`) REFERENCES `hardware` (`codhardware`),
  ADD CONSTRAINT `codoperacao` FOREIGN KEY (`codoperacao`) REFERENCES `operacao` (`codoperacao`),
  ADD CONSTRAINT `codtecnico` FOREIGN KEY (`codtecnico`) REFERENCES `tecnico` (`codtecnico`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
