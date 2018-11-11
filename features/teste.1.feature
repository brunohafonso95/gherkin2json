@pesquisaGoogle
Feature: Google2 
 
Scenario: Pesquisa Simples2
	Given Internet 
	When Abre o Google 
	Then Pagina carrega. 
	When Realizar Pesquisa 
	Then Campo preenchido com texto 
	When Busca e realizada 
	Then Pagina carrega trazendo resultado



