@pesquisaGoogle
Feature: Google 
 
Scenario: Pesquisa Simples 
	Given Internet 
	When Abre o Google 
	Then Pagina carrega. 
	When Realizar Pesquisa 
	Then Campo preenchido com texto 
	When Busca e realizada 
	Then Pagina carrega trazendo resultado

Scenario: Pesquisa Simples2
	Given Internet Pesquisa Simples2
	When Abre o Google Pesquisa Simples2

Scenario: scenario3
	Given Internet scenario3 
	When Abre o Google scenario3
	



