#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Gera o acervo legislativo inicial de Educação Especial e Inclusiva em public/data/.
Estruturado no formato padrão consumido pelo leitor:
- indice.json
- <caminho>/norma.json
- <caminho>/estrutura.json
- <caminho>/dispositivos.json
"""

import json
import os
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "public" / "data"

def salvar_norma(caminho_rel, norma_meta, estrutura, dispositivos):
    norma_path = DATA_DIR / caminho_rel
    norma_path.mkdir(parents=True, exist_ok=True)
    
    with open(norma_path / "norma.json", "w", encoding="utf-8") as f:
        json.dump(norma_meta, f, ensure_ascii=False, indent=2)
        
    with open(norma_path / "estrutura.json", "w", encoding="utf-8") as f:
        json.dump(estrutura, f, ensure_ascii=False, indent=2)
        
    with open(norma_path / "dispositivos.json", "w", encoding="utf-8") as f:
        json.dump(dispositivos, f, ensure_ascii=False, indent=2)
    print(f"Norma salva em {norma_path} ({len(dispositivos)} dispositivos)")

def build_versao(texto, data="2015-07-06", evento="publicacao-original", fonte="planalto"):
    return [{
        "texto": texto,
        "vigenteDesde": data,
        "vigenteAte": None,
        "evento": evento,
        "origem": None,
        "vigenciaConfirmada": True,
        "capturadoEm": "2026-09-22",
        "fonte": fonte
    }]

def gerar_corpus():
    indice = []

    # =========================================================================
    # 1. LEI BRASILEIRA DE INCLUSÃO - LEI Nº 13.146/2015
    # =========================================================================
    lbi_caminho = "br/federal/lei/2015-13146"
    lbi_meta = {
        "urn": "urn:lex:br:federal:lei:2015-07-06;13146",
        "nome": "Lei Brasileira de Inclusão da Pessoa com Deficiência (LBI)",
        "sigla": "LBI",
        "ano": 2015,
        "ementa": "Institui a Lei Brasileira de Inclusão da Pessoa com Deficiência (Estatuto da Pessoa com Deficiência).",
        "dataPublicacao": "2015-07-07",
        "fonte": "planalto",
        "urlFonte": "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13146.htm",
        "capturadoEm": "2026-09-22",
        "temas": ["Acessibilidade", "Educação Inclusiva", "Apoio Escolar", "Adaptação Curricular", "Não Discriminação"]
    }
    indice.append({
        "urn": lbi_meta["urn"],
        "nome": lbi_meta["nome"],
        "sigla": lbi_meta["sigla"],
        "ano": lbi_meta["ano"],
        "caminho": lbi_caminho,
        "temas": lbi_meta["temas"]
    })

    lbi_estrutura = [
        {
            "tipo": "livro",
            "rotulo": "LIVRO I",
            "rubrica": "PARTE GERAL",
            "filhos": [
                {
                    "tipo": "titulo",
                    "rotulo": "TÍTULO I",
                    "rubrica": "DISPOSIÇÕES PRELIMINARES",
                    "filhos": [
                        {
                            "tipo": "capitulo",
                            "rotulo": "CAPÍTULO I",
                            "rubrica": "DISPOSIÇÕES GERAIS",
                            "filhos": [
                                {"tipo": "artigo", "rotulo": "Art. 1º", "rubrica": None, "id": "lbi_art1", "filhos": []},
                                {"tipo": "artigo", "rotulo": "Art. 2º", "rubrica": None, "id": "lbi_art2", "filhos": []},
                                {"tipo": "artigo", "rotulo": "Art. 3º", "rubrica": None, "id": "lbi_art3", "filhos": []},
                                {"tipo": "artigo", "rotulo": "Art. 4º", "rubrica": None, "id": "lbi_art4", "filhos": []}
                            ]
                        }
                    ]
                },
                {
                    "tipo": "titulo",
                    "rotulo": "TÍTULO II",
                    "rubrica": "DOS DIREITOS FUNDAMENTAIS",
                    "filhos": [
                        {
                            "tipo": "capitulo",
                            "rotulo": "CAPÍTULO IV",
                            "rubrica": "DO DIREITO À EDUCAÇÃO",
                            "filhos": [
                                {"tipo": "artigo", "rotulo": "Art. 27", "rubrica": None, "id": "lbi_art27", "filhos": []},
                                {"tipo": "artigo", "rotulo": "Art. 28", "rubrica": None, "id": "lbi_art28", "filhos": []},
                                {"tipo": "artigo", "rotulo": "Art. 29", "rubrica": None, "id": "lbi_art29", "filhos": []},
                                {"tipo": "artigo", "rotulo": "Art. 30", "rubrica": None, "id": "lbi_art30", "filhos": []}
                            ]
                        }
                    ]
                }
            ]
        }
    ]

    lbi_dispositivos = [
        # Art. 1º
        {
            "id": "lbi_art1", "tipo": "artigo", "rotulo": "Art. 1º", "rubrica": None, "pai": None,
            "temas": ["Direito e Não Discriminação"],
            "versoes": build_versao("É instituída a Lei Brasileira de Inclusão da Pessoa com Deficiência (Estatuto da Pessoa com Deficiência), destinada a assegurar e a promover, em condições de igualdade, o exercício dos direitos e das liberdades fundamentais por pessoa com deficiência, visando à sua inclusão social e cidadania."),
            "observacoes": []
        },
        {
            "id": "lbi_art1_paru", "tipo": "paragrafo", "rotulo": "Parágrafo único", "rubrica": None, "pai": "lbi_art1",
            "temas": ["Direito e Não Discriminação"],
            "versoes": build_versao("Esta Lei tem como base a Convenção sobre os Direitos das Pessoas com Deficiência e seu Protocolo Facultativo, ratificados pelo Congresso Nacional por meio do Decreto Legislativo nº 186, de 9 de julho de 2008, em conformidade com o procedimento do § 3º do art. 5º da Constituição da República Federativa do Brasil, em vigor para o Brasil, no plano jurídico externo, desde 31 de agosto de 2008, e promulgados pelo Decreto nº 6.949, de 25 de agosto de 2009, data de início de sua vigência no plano interno."),
            "observacoes": []
        },
        # Art. 2º
        {
            "id": "lbi_art2", "tipo": "artigo", "rotulo": "Art. 2º", "rubrica": None, "pai": None,
            "temas": ["Direito e Não Discriminação"],
            "versoes": build_versao("Considera-se pessoa com deficiência aquela que tem impedimento de longo prazo de natureza física, mental, intelectual ou sensorial, o qual, em interação com uma ou mais barreiras, pode obstruir sua participação plena e efetiva na sociedade em igualdade de condições com as demais pessoas."),
            "observacoes": []
        },
        {
            "id": "lbi_art2_par1", "tipo": "paragrafo", "rotulo": "§ 1º", "rubrica": None, "pai": "lbi_art2",
            "temas": ["Direito e Não Discriminação"],
            "versoes": build_versao("A avaliação da deficiência, quando necessária, será biopsicossocial, realizada por equipe multiprofissional e interdisciplinar e considerará:"),
            "observacoes": []
        },
        {
            "id": "lbi_art2_par1_inc1", "tipo": "inciso", "rotulo": "I -", "rubrica": None, "pai": "lbi_art2_par1",
            "temas": ["Direito e Não Discriminação"],
            "versoes": build_versao("os impedimentos nas funções e nas estruturas do corpo;"),
            "observacoes": []
        },
        {
            "id": "lbi_art2_par1_inc2", "tipo": "inciso", "rotulo": "II -", "rubrica": None, "pai": "lbi_art2_par1",
            "temas": ["Acessibilidade e Tecnologia Assistiva"],
            "versoes": build_versao("os fatores socioambientais, psicológicos e pessoais;"),
            "observacoes": []
        },
        {
            "id": "lbi_art2_par1_inc3", "tipo": "inciso", "rotulo": "III -", "rubrica": None, "pai": "lbi_art2_par1",
            "temas": ["Acessibilidade e Tecnologia Assistiva"],
            "versoes": build_versao("a limitação no desempenho de atividades; e"),
            "observacoes": []
        },
        {
            "id": "lbi_art2_par1_inc4", "tipo": "inciso", "rotulo": "IV -", "rubrica": None, "pai": "lbi_art2_par1",
            "temas": ["Acessibilidade e Tecnologia Assistiva"],
            "versoes": build_versao("a restrição de participação."),
            "observacoes": []
        },
        # Art. 3º (Definições fundamentais: Acessibilidade, Desenho Universal, Tecnologia Assistiva, Profissional de apoio escolar)
        {
            "id": "lbi_art3", "tipo": "artigo", "rotulo": "Art. 3º", "rubrica": None, "pai": None,
            "temas": ["Acessibilidade e Tecnologia Assistiva", "Profissional de Apoio"],
            "versoes": build_versao("Para fins de aplicação desta Lei, consideram-se:"),
            "observacoes": []
        },
        {
            "id": "lbi_art3_inc1", "tipo": "inciso", "rotulo": "I -", "rubrica": None, "pai": "lbi_art3",
            "temas": ["Acessibilidade e Tecnologia Assistiva"],
            "versoes": build_versao("acessibilidade: possibilidade e condição de alcance para utilização, com segurança e autonomia, de espaços, mobiliários, equipamentos urbanos, edificações, transportes, informação e comunicação, inclusive seus sistemas e tecnologias, bem como de outros serviços e instalações abertos ao público, de uso público ou privados de uso coletivo, tanto na zona urbana como na rural, por pessoa com deficiência ou com mobilidade reduzida;"),
            "observacoes": []
        },
        {
            "id": "lbi_art3_inc2", "tipo": "inciso", "rotulo": "II -", "rubrica": None, "pai": "lbi_art3",
            "temas": ["Adaptação Curricular & PEI", "Acessibilidade e Tecnologia Assistiva"],
            "versoes": build_versao("desenho universal: concepção de produtos, ambientes, programas e serviços a serem usados por todas as pessoas, sem necessidade de adaptação ou de projeto específico, incluindo os recursos de tecnologia assistiva;"),
            "observacoes": []
        },
        {
            "id": "lbi_art3_inc3", "tipo": "inciso", "rotulo": "III -", "rubrica": None, "pai": "lbi_art3",
            "temas": ["Acessibilidade e Tecnologia Assistiva"],
            "versoes": build_versao("tecnologia assistiva ou ajuda técnica: produtos, equipamentos, dispositivos, recursos, metodologias, estratégias, práticas e serviços que objetivem promover a funcionalidade, relacionada à atividade e à participação da pessoa com deficiência ou com mobilidade reduzida, visando à sua autonomia, independência, qualidade de vida e inclusão social;"),
            "observacoes": []
        },
        {
            "id": "lbi_art3_inc6", "tipo": "inciso", "rotulo": "VI -", "rubrica": None, "pai": "lbi_art3",
            "temas": ["Adaptação Curricular & PEI"],
            "versoes": build_versao("adaptações razoáveis: adaptações, modificações e ajustes necessários e adequados que não acarretem ônus desproporcional e indevido, quando requeridos em cada caso, a fim de assegurar que a pessoa com deficiência possa gozar ou exercer, em igualdade de condições e oportunidades com as demais pessoas, todos os direitos e liberdades fundamentais;"),
            "observacoes": []
        },
        {
            "id": "lbi_art3_inc13", "tipo": "inciso", "rotulo": "XIII -", "rubrica": None, "pai": "lbi_art3",
            "temas": ["Profissional de Apoio"],
            "versoes": build_versao("profissional de apoio escolar: pessoa que exerce atividades de alimentação, higiene e locomoção do estudante com deficiência e atua em todas as atividades escolares nas quais se fizer necessária, em todos os níveis e modalidades de ensino, em instituições públicas e privadas, excluídas as técnicas ou os procedimentos identificados com profissões legalmente estabelecidas;"),
            "observacoes": []
        },
        {
            "id": "lbi_art3_inc14", "tipo": "inciso", "rotulo": "XIV -", "rubrica": None, "pai": "lbi_art3",
            "temas": ["Profissional de Apoio"],
            "versoes": build_versao("atendente pessoal: pessoa, membro ou não da família, que, com ou sem remuneração, assiste ou presta cuidados básicos e essenciais à pessoa com deficiência no exercício de suas atividades diárias, excluídas as técnicas ou os procedimentos identificados com profissões legalmente estabelecidas."),
            "observacoes": []
        },
        # Art. 4º
        {
            "id": "lbi_art4", "tipo": "artigo", "rotulo": "Art. 4º", "rubrica": None, "pai": None,
            "temas": ["Direito e Não Discriminação"],
            "versoes": build_versao("Toda pessoa com deficiência tem direito à igualdade de oportunidades com as demais pessoas e não sofrerá nenhuma espécie de discriminação."),
            "observacoes": []
        },
        {
            "id": "lbi_art4_par1", "tipo": "paragrafo", "rotulo": "§ 1º", "rubrica": None, "pai": "lbi_art4",
            "temas": ["Direito e Não Discriminação"],
            "versoes": build_versao("Considera-se discriminação em razão da deficiência toda forma de distinção, restrição ou exclusão, por ação ou omissão, que tenha o propósito ou o efeito de prejudicar, impedir ou anular o reconhecimento ou o exercício dos direitos e das liberdades fundamentais de pessoa com deficiência, incluindo a recusa de adaptações razoáveis e de fornecimento de tecnologias assistivas."),
            "observacoes": []
        },
        # CAPÍTULO IV - DO DIREITO À EDUCAÇÃO (Arts. 27 a 30)
        # Art. 27
        {
            "id": "lbi_art27", "tipo": "artigo", "rotulo": "Art. 27", "rubrica": None, "pai": None,
            "temas": ["Direito e Não Discriminação", "Adaptação Curricular & PEI"],
            "versoes": build_versao("A educação constitui direito da pessoa com deficiência, assegurados sistema educacional inclusivo em todos os níveis e aprendizado ao longo de toda a vida, de forma a alcançar o máximo desenvolvimento possível de seus talentos e habilidades físicas, sensoriais, intelectuais e sociais, segundo suas características, interesses e necessidades de aprendizagem."),
            "observacoes": []
        },
        {
            "id": "lbi_art27_paru", "tipo": "paragrafo", "rotulo": "Parágrafo único", "rubrica": None, "pai": "lbi_art27",
            "temas": ["Direito e Não Discriminação"],
            "versoes": build_versao("É dever do Estado, da família, da comunidade escolar e da sociedade assegurar educação de qualidade à pessoa com deficiência, colocando-a a salvo de toda forma de violência, negligência e discriminação."),
            "observacoes": []
        },
        # Art. 28 - O coração pedagógico da LBI
        {
            "id": "lbi_art28", "tipo": "artigo", "rotulo": "Art. 28", "rubrica": None, "pai": None,
            "temas": ["AEE", "Adaptação Curricular & PEI", "Profissional de Apoio", "Libras e Bilinguismo"],
            "versoes": build_versao("Incumbe ao poder público assegurar, criar, desenvolver, implementar, incentivar, acompanhar e avaliar:"),
            "observacoes": []
        },
        {
            "id": "lbi_art28_inc1", "tipo": "inciso", "rotulo": "I -", "rubrica": None, "pai": "lbi_art28",
            "temas": ["Adaptação Curricular & PEI", "AEE"],
            "versoes": build_versao("sistema educacional inclusivo em todos os níveis e modalidades, bem como o aprendizado ao longo de toda a vida;"),
            "observacoes": []
        },
        {
            "id": "lbi_art28_inc2", "tipo": "inciso", "rotulo": "II -", "rubrica": None, "pai": "lbi_art28",
            "temas": ["Adaptação Curricular & PEI", "AEE"],
            "versoes": build_versao("aprimoramento dos sistemas de ensino, visando a garantir condições de acesso, permanência, participação e aprendizagem, por meio da oferta de serviços e de recursos de acessibilidade que eliminem as barreiras e promovam a inclusão plena;"),
            "observacoes": []
        },
        {
            "id": "lbi_art28_inc3", "tipo": "inciso", "rotulo": "III -", "rubrica": None, "pai": "lbi_art28",
            "temas": ["Adaptação Curricular & PEI", "AEE"],
            "versoes": build_versao("projeto pedagógico que institucionalize o atendimento educacional especializado, assim como os demais serviços e adaptações razoáveis, para atender às características dos estudantes com deficiência e garantir o seu pleno acesso ao currículo em condições de igualdade, promovendo a conquista e o exercício de sua autonomia;"),
            "observacoes": []
        },
        {
            "id": "lbi_art28_inc4", "tipo": "inciso", "rotulo": "IV -", "rubrica": None, "pai": "lbi_art28",
            "temas": ["Libras e Bilinguismo"],
            "versoes": build_versao("oferta de educação bilíngue, em Libras como primeira língua e na modalidade escrita da Língua Portuguesa como segunda língua, em escolas e classes bilíngues e em escolas inclusivas;"),
            "observacoes": []
        },
        {
            "id": "lbi_art28_inc5", "tipo": "inciso", "rotulo": "V -", "rubrica": None, "pai": "lbi_art28",
            "temas": ["Acessibilidade e Tecnologia Assistiva"],
            "versoes": build_versao("adoção de medidas individualizadas e coletivas em ambientes que maximizem o desenvolvimento acadêmico e social dos estudantes com deficiência, favorecendo o acesso, a permanência, a participação e a aprendizagem em instituições de ensino;"),
            "observacoes": []
        },
        {
            "id": "lbi_art28_inc6", "tipo": "inciso", "rotulo": "VI -", "rubrica": None, "pai": "lbi_art28",
            "temas": ["Acessibilidade e Tecnologia Assistiva"],
            "versoes": build_versao("pesquisas voltadas para o desenvolvimento de novos métodos e técnicas pedagógicas, de materiais didáticos, de equipamentos e de recursos de tecnologia assistiva;"),
            "observacoes": []
        },
        {
            "id": "lbi_art28_inc7", "tipo": "inciso", "rotulo": "VII -", "rubrica": None, "pai": "lbi_art28",
            "temas": ["Adaptação Curricular & PEI", "AEE"],
            "versoes": build_versao("planejamento de estudo e de desenvolvimento de plano de atendimento educacional especializado, de organização de recursos e serviços de acessibilidade e de disponibilização e usabilidade pedagógica de recursos de tecnologia assistiva;"),
            "observacoes": []
        },
        {
            "id": "lbi_art28_inc8", "tipo": "inciso", "rotulo": "VIII -", "rubrica": None, "pai": "lbi_art28",
            "temas": ["AEE"],
            "versoes": build_versao("participação dos estudantes com deficiência e de suas famílias nas diversas instâncias de atuação da comunidade escolar;"),
            "observacoes": []
        },
        {
            "id": "lbi_art28_inc9", "tipo": "inciso", "rotulo": "IX -", "rubrica": None, "pai": "lbi_art28",
            "temas": ["Adaptação Curricular & PEI"],
            "versoes": build_versao("adoção de medidas de apoio que favoreçam o desenvolvimento dos aspectos linguísticos, culturais, vocacionais e socioemocionais dos estudantes com deficiência;"),
            "observacoes": []
        },
        {
            "id": "lbi_art28_inc10", "tipo": "inciso", "rotulo": "X -", "rubrica": None, "pai": "lbi_art28",
            "temas": ["AEE"],
            "versoes": build_versao("adoção de práticas pedagógicas inclusivas pelos programas de formação inicial e continuada de professores e oferta de formação continuada para o atendimento educacional especializado;"),
            "observacoes": []
        },
        {
            "id": "lbi_art28_inc11", "tipo": "inciso", "rotulo": "XI -", "rubrica": None, "pai": "lbi_art28",
            "temas": ["Adaptação Curricular & PEI", "Acessibilidade e Tecnologia Assistiva"],
            "versoes": build_versao("formação e disponibilização de professores para o atendimento educacional especializado, de tradutores e intérpretes da Libras, de guias-intérpretes e de profissionais de apoio escolar;"),
            "observacoes": []
        },
        {
            "id": "lbi_art28_inc12", "tipo": "inciso", "rotulo": "XII -", "rubrica": None, "pai": "lbi_art28",
            "temas": ["Acessibilidade e Tecnologia Assistiva"],
            "versoes": build_versao("oferta de ensino da Libras, do Sistema Braille e de uso de recursos de tecnologia assistiva, de forma a ampliar habilidades de comunicação dos estudantes;"),
            "observacoes": []
        },
        {
            "id": "lbi_art28_inc13", "tipo": "inciso", "rotulo": "XIII -", "rubrica": None, "pai": "lbi_art28",
            "temas": ["Acessibilidade e Tecnologia Assistiva"],
            "versoes": build_versao("acesso à educação superior e à educação profissional e tecnológica em igualdade de oportunidades e condições com as demais pessoas;"),
            "observacoes": []
        },
        {
            "id": "lbi_art28_inc14", "tipo": "inciso", "rotulo": "XIV -", "rubrica": None, "pai": "lbi_art28",
            "temas": ["Acessibilidade e Tecnologia Assistiva"],
            "versoes": build_versao("inclusão em conteúdos curriculares, em cursos de nível superior e de educação profissional técnica e tecnológica, de temas relacionados à pessoa com deficiência nos respectivos campos de conhecimento;"),
            "observacoes": []
        },
        {
            "id": "lbi_art28_inc15", "tipo": "inciso", "rotulo": "XV -", "rubrica": None, "pai": "lbi_art28",
            "temas": ["Acessibilidade e Tecnologia Assistiva"],
            "versoes": build_versao("disponibilização de processos seletivos para ingresso nos cursos de educação superior e de educação profissional e tecnológica em formatos acessíveis;"),
            "observacoes": []
        },
        {
            "id": "lbi_art28_inc16", "tipo": "inciso", "rotulo": "XVI -", "rubrica": None, "pai": "lbi_art28",
            "temas": ["Acessibilidade e Tecnologia Assistiva"],
            "versoes": build_versao("acessibilidade para os estudantes com deficiência nos processos seletivos das instituições de educação superior e de educação profissional e tecnológica, com disponibilização de tempo adicional, recursos de acessibilidade e de tecnologia assistiva;"),
            "observacoes": []
        },
        {
            "id": "lbi_art28_inc17", "tipo": "inciso", "rotulo": "XVII -", "rubrica": None, "pai": "lbi_art28",
            "temas": ["Profissional de Apoio"],
            "versoes": build_versao("oferta de profissionais de apoio escolar;"),
            "observacoes": []
        },
        {
            "id": "lbi_art28_inc18", "tipo": "inciso", "rotulo": "XVIII -", "rubrica": None, "pai": "lbi_art28",
            "temas": ["Acessibilidade e Tecnologia Assistiva"],
            "versoes": build_versao("orientação à comunidade escolar a respeito de direitos e de normas de acessibilidade, bem como sobre a eliminação de preconceito e de todas as formas de discriminação."),
            "observacoes": []
        },
        {
            "id": "lbi_art28_par1", "tipo": "paragrafo", "rotulo": "§ 1º", "rubrica": None, "pai": "lbi_art28",
            "temas": ["Direito e Não Discriminação"],
            "versoes": build_versao("Às instituições privadas, de qualquer nível e modalidade de ensino, aplica-se obrigatoriamente o disposto nos incisos I, II, III, V, VII, VIII, IX, X, XI, XII, XIII, XIV, XV, XVI, XVII e XVIII do caput deste artigo, sendo vedada a cobrança de valores adicionais de qualquer natureza em suas mensalidades, anuidades e matrículas no cumprimento dessas determinações."),
            "observacoes": []
        },
        {
            "id": "lbi_art28_par2", "tipo": "paragrafo", "rotulo": "§ 2º", "rubrica": None, "pai": "lbi_art28",
            "temas": ["Direito e Não Discriminação"],
            "versoes": build_versao("Na disponibilização de tradutores e intérpretes da Libras a que se refere o inciso XI do caput deste artigo, deve-se observar o seguinte:"),
            "observacoes": []
        },
        {
            "id": "lbi_art28_par2_inc1", "tipo": "inciso", "rotulo": "I -", "rubrica": None, "pai": "lbi_art28_par2",
            "temas": ["Libras e Bilinguismo"],
            "versoes": build_versao("os tradutores e intérpretes da Libras atuantes na educação básica devem, no mínimo, possuir ensino médio completo e certificado de proficiência na Libras;"),
            "observacoes": []
        },
        {
            "id": "lbi_art28_par2_inc2", "tipo": "inciso", "rotulo": "II -", "rubrica": None, "pai": "lbi_art28_par2",
            "temas": ["Libras e Bilinguismo"],
            "versoes": build_versao("os tradutores e intérpretes da Libras atuantes na educação superior devem possuir curso superior, com habilitação, prioritariamente, em Tradução e Interpretação de Libras."),
            "observacoes": []
        },
        # Art. 29
        {
            "id": "lbi_art29", "tipo": "artigo", "rotulo": "Art. 29", "rubrica": None, "pai": None,
            "temas": ["AEE", "Adaptação Curricular & PEI"],
            "versoes": build_versao("As instituições de ensino da educação básica e superior deverão proporcionar condições de acesso, permanência, participação e aprendizado, por meio da oferta de serviços e de recursos de acessibilidade que eliminem as barreiras e promovam a inclusão plena de estudantes com deficiência."),
            "observacoes": []
        },
        # Art. 30
        {
            "id": "lbi_art30", "tipo": "artigo", "rotulo": "Art. 30", "rubrica": None, "pai": None,
            "temas": ["Acessibilidade e Tecnologia Assistiva"],
            "versoes": build_versao("Nos processos seletivos para ingresso e permanência nos cursos oferecidos pelas instituições de ensino superior e de educação profissional e tecnológica, públicas e privadas, devem ser adotadas as seguintes medidas relativas à acessibilidade para a pessoa com deficiência:"),
            "observacoes": []
        },
        {
            "id": "lbi_art30_inc1", "tipo": "inciso", "rotulo": "I -", "rubrica": None, "pai": "lbi_art30",
            "temas": ["Acessibilidade e Tecnologia Assistiva"],
            "versoes": build_versao("atendimento preferencial à pessoa com deficiência desde a inscrição até a divulgação dos resultados;"),
            "observacoes": []
        },
        {
            "id": "lbi_art30_inc2", "tipo": "inciso", "rotulo": "II -", "rubrica": None, "pai": "lbi_art30",
            "temas": ["Acessibilidade e Tecnologia Assistiva"],
            "versoes": build_versao("disponibilização de formulário de inscrição em formatos acessíveis;"),
            "observacoes": []
        },
        {
            "id": "lbi_art30_inc3", "tipo": "inciso", "rotulo": "III -", "rubrica": None, "pai": "lbi_art30",
            "temas": ["Acessibilidade e Tecnologia Assistiva"],
            "versoes": build_versao("disponibilização de provas em formatos acessíveis para os candidatos com deficiência;"),
            "observacoes": []
        },
        {
            "id": "lbi_art30_inc4", "tipo": "inciso", "rotulo": "IV -", "rubrica": None, "pai": "lbi_art30",
            "temas": ["Acessibilidade e Tecnologia Assistiva"],
            "versoes": build_versao("disponibilização de recursos de acessibilidade e de tecnologia assistiva adequados, previamente solicitados e escolhidos pelo candidato com deficiência;"),
            "observacoes": []
        },
        {
            "id": "lbi_art30_inc5", "tipo": "inciso", "rotulo": "V -", "rubrica": None, "pai": "lbi_art30",
            "temas": ["Acessibilidade e Tecnologia Assistiva"],
            "versoes": build_versao("dilação de tempo, conforme demanda apresentada pelo candidato com deficiência, tanto na realização de exame para seleção como nos atos decorrentes da vida acadêmica;"),
            "observacoes": []
        },
        {
            "id": "lbi_art30_inc6", "tipo": "inciso", "rotulo": "VI -", "rubrica": None, "pai": "lbi_art30",
            "temas": ["Libras e Bilinguismo"],
            "versoes": build_versao("adoção de critérios de avaliação das provas escritas, discursivas ou de redação que considerem a singularidade linguística da pessoa com deficiência, no domínio da modalidade escrita da língua portuguesa;"),
            "observacoes": []
        },
        {
            "id": "lbi_art30_inc7", "tipo": "inciso", "rotulo": "VII -", "rubrica": None, "pai": "lbi_art30",
            "temas": ["Libras e Bilinguismo"],
            "versoes": build_versao("tradução completa do edital e de suas retificações em Libras."),
            "observacoes": []
        }
    ]
    salvar_norma(lbi_caminho, lbi_meta, lbi_estrutura, lbi_dispositivos)


    # =========================================================================
    # 2. LDB - LEI Nº 9.394/1996 (EDUCAÇÃO ESPECIAL E BILÍNGUE DE SURDOS)
    # =========================================================================
    ldb_caminho = "br/federal/lei/1996-9394-educacao-especial"
    ldb_meta = {
        "urn": "urn:lex:br:federal:lei:1996-12-20;9394",
        "nome": "LDB - Diretrizes e Bases da Educação Nacional (Educação Especial e Bilíngue)",
        "sigla": "LDB (Cap. V e V-A)",
        "ano": 1996,
        "ementa": "Estabelece as diretrizes e bases da educação nacional. Disposições sobre a Educação Especial e Educação Bilíngue de Surdos.",
        "dataPublicacao": "1996-12-23",
        "fonte": "planalto",
        "urlFonte": "https://www.planalto.gov.br/ccivil_03/leis/l9394.htm",
        "capturadoEm": "2026-09-22",
        "temas": ["Educação Especial", "AEE", "Libras e Bilinguismo", "Adaptação Curricular & PEI"]
    }
    indice.append({
        "urn": ldb_meta["urn"],
        "nome": ldb_meta["nome"],
        "sigla": ldb_meta["sigla"],
        "ano": ldb_meta["ano"],
        "caminho": ldb_caminho,
        "temas": ldb_meta["temas"]
    })

    ldb_estrutura = [
        {
            "tipo": "titulo",
            "rotulo": "TÍTULO V",
            "rubrica": "DOS NÍVEIS E DAS MODALIDADES DE EDUCAÇÃO E ENSINO",
            "filhos": [
                {
                    "tipo": "capitulo",
                    "rotulo": "CAPÍTULO V",
                    "rubrica": "DA EDUCAÇÃO ESPECIAL",
                    "filhos": [
                        {"tipo": "artigo", "rotulo": "Art. 58", "rubrica": None, "id": "ldb_art58", "filhos": []},
                        {"tipo": "artigo", "rotulo": "Art. 59", "rubrica": None, "id": "ldb_art59", "filhos": []},
                        {"tipo": "artigo", "rotulo": "Art. 59-A", "rubrica": None, "id": "ldb_art59a", "filhos": []},
                        {"tipo": "artigo", "rotulo": "Art. 60", "rubrica": None, "id": "ldb_art60", "filhos": []}
                    ]
                },
                {
                    "tipo": "capitulo",
                    "rotulo": "CAPÍTULO V-A",
                    "rubrica": "DA EDUCAÇÃO BILÍNGUE DE SURDOS",
                    "filhos": [
                        {"tipo": "artigo", "rotulo": "Art. 60-A", "rubrica": None, "id": "ldb_art60a", "filhos": []},
                        {"tipo": "artigo", "rotulo": "Art. 60-B", "rubrica": None, "id": "ldb_art60b", "filhos": []}
                    ]
                }
            ]
        }
    ]

    ldb_dispositivos = [
        # Art. 58
        {
            "id": "ldb_art58", "tipo": "artigo", "rotulo": "Art. 58", "rubrica": None, "pai": None,
            "temas": ["AEE", "Educação Especial"],
            "versoes": build_versao("Entende-se por educação especial, para os efeitos desta Lei, a modalidade de educação escolar oferecida preferencialmente na rede regular de ensino, para educandos com deficiência, transtornos globais do desenvolvimento e altas habilidades ou superdotação.", data="2013-04-05", evento="redacao-dada"),
            "observacoes": []
        },
        {
            "id": "ldb_art58_par1", "tipo": "paragrafo", "rotulo": "§ 1º", "rubrica": None, "pai": "ldb_art58",
            "temas": ["AEE", "Acessibilidade e Tecnologia Assistiva"],
            "versoes": build_versao("Haverá, quando necessário, serviços de apoio especializado, na escola regular, para atender às peculiaridades da clientela de educação especial."),
            "observacoes": []
        },
        {
            "id": "ldb_art58_par2", "tipo": "paragrafo", "rotulo": "§ 2º", "rubrica": None, "pai": "ldb_art58",
            "temas": ["Educação Especial"],
            "versoes": build_versao("O atendimento educacional será feito em classes, escolas ou serviços especializados, sempre que, em função das condições específicas dos alunos, não for possível a sua integração nas classes comuns de ensino regular."),
            "observacoes": []
        },
        {
            "id": "ldb_art58_par3", "tipo": "paragrafo", "rotulo": "§ 3º", "rubrica": None, "pai": "ldb_art58",
            "temas": ["AEE", "Direito e Não Discriminação"],
            "versoes": build_versao("A oferta de educação especial, dever constitucional do Estado, tem início na educação infantil e estende-se ao longo da vida, observados o inciso III do caput do art. 4º e o parágrafo único do art. 60 desta Lei.", data="2018-04-17", evento="redacao-dada"),
            "observacoes": []
        },
        # Art. 59
        {
            "id": "ldb_art59", "tipo": "artigo", "rotulo": "Art. 59", "rotuloOriginal": "Art. 59", "rubrica": None, "pai": None,
            "temas": ["Adaptação Curricular & PEI", "AEE", "Profissional de Apoio"],
            "versoes": build_versao("Os sistemas de ensino assegurarão aos educandos com deficiência, transtornos globais do desenvolvimento e altas habilidades ou superdotação:"),
            "observacoes": []
        },
        {
            "id": "ldb_art59_inc1", "tipo": "inciso", "rotulo": "I -", "rubrica": None, "pai": "ldb_art59",
            "temas": ["Adaptação Curricular & PEI"],
            "versoes": build_versao("currículos, métodos, técnicas, recursos educativos e organização específicos, para atender às suas necessidades;"),
            "observacoes": []
        },
        {
            "id": "ldb_art59_inc2", "tipo": "inciso", "rotulo": "II -", "rubrica": None, "pai": "ldb_art59",
            "temas": ["Adaptação Curricular & PEI"],
            "versoes": build_versao("terminalidade específica para aqueles que não puderem atingir o nível exigido para a conclusão do ensino fundamental, em virtude de suas deficiências, e aceleração para concluir em menor tempo o programa escolar para os superdotados;"),
            "observacoes": []
        },
        {
            "id": "ldb_art59_inc3", "tipo": "inciso", "rotulo": "III -", "rubrica": None, "pai": "ldb_art59",
            "temas": ["AEE", "Profissional de Apoio"],
            "versoes": build_versao("professores com especialização adequada em nível médio ou superior, para atendimento especializado, bem como professores do ensino regular capacitados para a integração desses educandos nas classes comuns;"),
            "observacoes": []
        },
        {
            "id": "ldb_art59_inc4", "tipo": "inciso", "rotulo": "IV -", "rubrica": None, "pai": "ldb_art59",
            "temas": ["Adaptação Curricular & PEI"],
            "versoes": build_versao("educação especial para o trabalho, visando a sua efetiva integração na vida em sociedade, inclusive condições favoráveis para os que não revelarem capacidade de inserção no trabalho competitivo, mediante articulação com os órgãos oficiais afins, bem como para aqueles que apresentam uma habilidade superior nas áreas artística, intelectual ou psicomotora;"),
            "observacoes": []
        },
        {
            "id": "ldb_art59_inc5", "tipo": "inciso", "rotulo": "V -", "rubrica": None, "pai": "ldb_art59",
            "temas": ["Direito e Não Discriminação"],
            "versoes": build_versao("acesso igualitário aos benefícios dos programas sociais suplementares disponíveis para o respectivo nível do ensino regular."),
            "observacoes": []
        },
        # Art. 59-A
        {
            "id": "ldb_art59a", "tipo": "artigo", "rotulo": "Art. 59-A", "rubrica": None, "pai": None,
            "temas": ["Educação Especial", "AEE"],
            "versoes": build_versao("O poder público deverá instituir cadastro nacional de alunos com altas habilidades ou superdotação matriculados na educação básica e na educação superior, a fim de fomentar a execução de políticas públicas destinadas ao desenvolvimento pleno das potencialidades desse alunado.", data="2015-12-30", evento="inclusao"),
            "observacoes": []
        },
        # Art. 60
        {
            "id": "ldb_art60", "tipo": "artigo", "rotulo": "Art. 60", "rubrica": None, "pai": None,
            "temas": ["Educação Especial", "Direito e Não Discriminação"],
            "versoes": build_versao("Os órgãos normativos dos sistemas de ensino estabelecerão critérios de caracterização das instituições privadas sem fins lucrativos, especializadas e com atuação exclusiva em educação especial, para fins de apoio técnico e financeiro pelo Poder Público."),
            "observacoes": []
        },
        {
            "id": "ldb_art60_paru", "tipo": "paragrafo", "rotulo": "Parágrafo único", "rubrica": None, "pai": "ldb_art60",
            "temas": ["Educação Especial", "Direito e Não Discriminação"],
            "versoes": build_versao("O poder público adotará, como alternativa preferencial, a ampliação do atendimento aos educandos com deficiência, transtornos globais do desenvolvimento e altas habilidades ou superdotação na própria rede pública regular de ensino, independentemente do apoio às instituições previstas neste artigo.", data="2013-04-05", evento="redacao-dada"),
            "observacoes": []
        },
        # CAPÍTULO V-A - EDUCAÇÃO BILÍNGUE DE SURDOS (Lei 14.191/2021)
        # Art. 60-A
        {
            "id": "ldb_art60a", "tipo": "artigo", "rotulo": "Art. 60-A", "rubrica": None, "pai": None,
            "temas": ["Libras e Bilinguismo"],
            "versoes": build_versao("Entende-se por educação bilíngue de surdos, para os efeitos desta Lei, a modalidade de educação escolar oferecida em Língua Brasileira de Sinais (Libras), como primeira língua, e em português escrito, como segunda língua, em escolas bilíngues de surdos, classes bilíngues de surdos, escolas comuns ou em polos de educação bilíngue de surdos, para educandos surdos, surdo-cegos, com deficiência auditiva associada a outras deficiências ou altas habilidades e superdotação, bem como para educandos que optarem por essa modalidade de ensino.", data="2021-08-04", evento="inclusao"),
            "observacoes": []
        },
        {
            "id": "ldb_art60a_par1", "tipo": "paragrafo", "rotulo": "§ 1º", "rubrica": None, "pai": "ldb_art60a",
            "temas": ["Libras e Bilinguismo"],
            "versoes": build_versao("A oferta de educação bilíngue de surdos terá início ao zero ano, na educação infantil, e estender-se-á ao longo da vida.", data="2021-08-04", evento="inclusao"),
            "observacoes": []
        },
        {
            "id": "ldb_art60a_par2", "tipo": "paragrafo", "rotulo": "§ 2º", "rubrica": None, "pai": "ldb_art60a",
            "temas": ["Libras e Bilinguismo", "Acessibilidade e Tecnologia Assistiva"],
            "versoes": build_versao("O atendimento aos educandos de que trata o caput deste artigo dar-se-á em materiais didáticos e recursos de tecnologia assistiva específicos, bem como em conformidade com as orientações pedagógicas da educação especial.", data="2021-08-04", evento="inclusao"),
            "observacoes": []
        },
        # Art. 60-B
        {
            "id": "ldb_art60b", "tipo": "artigo", "rotulo": "Art. 60-B", "rubrica": None, "pai": None,
            "temas": ["Libras e Bilinguismo"],
            "versoes": build_versao("Os sistemas de ensino assegurarão aos educandos surdos, surdo-cegos, com deficiência auditiva associada a outras deficiências ou altas habilidades e superdotação materiais didáticos e professores bilíngues com formação e especialização adequadas, em nível superior.", data="2021-08-04", evento="inclusao"),
            "observacoes": []
        },
        {
            "id": "ldb_art60b_paru", "tipo": "paragrafo", "rotulo": "Parágrafo único", "rubrica": None, "pai": "ldb_art60b",
            "temas": ["Libras e Bilinguismo"],
            "versoes": build_versao("Nos processos de contratação e de alocação de docentes, haverá prioridade para professores surdos nos termos da regulamentação.", data="2021-08-04", evento="inclusao"),
            "observacoes": []
        }
    ]
    salvar_norma(ldb_caminho, ldb_meta, ldb_estrutura, ldb_dispositivos)


    # =========================================================================
    # 3. CONSTITUIÇÃO FEDERAL DE 1988 (DA EDUCAÇÃO E DO AEE)
    # =========================================================================
    cf_caminho = "br/federal/constituicao/1988-educacao"
    cf_meta = {
        "urn": "urn:lex:br:federal:constituicao:1988-10-05",
        "nome": "Constituição Federal de 1988 - Da Educação",
        "sigla": "CF/88 (Arts. 205-214)",
        "ano": 1988,
        "ementa": "Constituição da República Federativa do Brasil de 1988. Capítulo III, Seção I - Da Educação (Arts. 205 a 214).",
        "dataPublicacao": "1988-10-05",
        "fonte": "planalto",
        "urlFonte": "https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm",
        "capturadoEm": "2026-09-22",
        "temas": ["Direito e Não Discriminação", "AEE"]
    }
    indice.append({
        "urn": cf_meta["urn"],
        "nome": cf_meta["nome"],
        "sigla": cf_meta["sigla"],
        "ano": cf_meta["ano"],
        "caminho": cf_caminho,
        "temas": cf_meta["temas"]
    })

    cf_estrutura = [
        {
            "tipo": "titulo",
            "rotulo": "TÍTULO VIII",
            "rubrica": "DA ORDEM SOCIAL",
            "filhos": [
                {
                    "tipo": "capitulo",
                    "rotulo": "CAPÍTULO III",
                    "rubrica": "DA EDUCAÇÃO, DA CULTURA E DO DESPORTO",
                    "filhos": [
                        {
                            "tipo": "secao",
                            "rotulo": "SEÇÃO I",
                            "rubrica": "DA EDUCAÇÃO",
                            "filhos": [
                                {"tipo": "artigo", "rotulo": "Art. 205", "rubrica": None, "id": "cf_art205", "filhos": []},
                                {"tipo": "artigo", "rotulo": "Art. 206", "rubrica": None, "id": "cf_art206", "filhos": []},
                                {"tipo": "artigo", "rotulo": "Art. 208", "rubrica": None, "id": "cf_art208", "filhos": []}
                            ]
                        }
                    ]
                }
            ]
        }
    ]

    cf_dispositivos = [
        # Art. 205
        {
            "id": "cf_art205", "tipo": "artigo", "rotulo": "Art. 205", "rubrica": None, "pai": None,
            "temas": ["Direito e Não Discriminação"],
            "versoes": build_versao("A educação, direito de todos e dever do Estado e da família, será promovida e incentivada com a colaboração da sociedade, visando ao pleno desenvolvimento da pessoa, seu preparo para o exercício da cidadania e sua qualificação para o trabalho."),
            "observacoes": []
        },
        # Art. 206
        {
            "id": "cf_art206", "tipo": "artigo", "rotulo": "Art. 206", "rubrica": None, "pai": None,
            "temas": ["Direito e Não Discriminação"],
            "versoes": build_versao("O ensino será ministrado com base nos seguintes princípios:"),
            "observacoes": []
        },
        {
            "id": "cf_art206_inc1", "tipo": "inciso", "rotulo": "I -", "rubrica": None, "pai": "cf_art206",
            "temas": ["Direito e Não Discriminação"],
            "versoes": build_versao("igualdade de condições para o acesso e permanência na escola;"),
            "observacoes": []
        },
        {
            "id": "cf_art206_inc2", "tipo": "inciso", "rotulo": "II -", "rubrica": None, "pai": "cf_art206",
            "temas": ["Adaptação Curricular & PEI"],
            "versoes": build_versao("liberdade de aprender, ensinar, pesquisar e divulgar o pensamento, a arte e o saber;"),
            "observacoes": []
        },
        {
            "id": "cf_art206_inc3", "tipo": "inciso", "rotulo": "III -", "rubrica": None, "pai": "cf_art206",
            "temas": ["Adaptação Curricular & PEI"],
            "versoes": build_versao("pluralismo de idéias e de concepções pedagógicas, e coexistência de instituições públicas e privadas de ensino;"),
            "observacoes": []
        },
        # Art. 208
        {
            "id": "cf_art208", "tipo": "artigo", "rotulo": "Art. 208", "rubrica": None, "pai": None,
            "temas": ["AEE", "Direito e Não Discriminação"],
            "versoes": build_versao("O dever do Estado com a educação será efetivado mediante a garantia de:"),
            "observacoes": []
        },
        {
            "id": "cf_art208_inc1", "tipo": "inciso", "rotulo": "I -", "rubrica": None, "pai": "cf_art208",
            "temas": ["Direito e Não Discriminação"],
            "versoes": build_versao("educação básica obrigatória e gratuita dos 4 (quatro) aos 17 (dezessete) anos de idade, assegurada inclusive sua oferta gratuita para todos os que a ela não tiveram acesso na idade própria;", data="2009-11-11", evento="redacao-dada"),
            "observacoes": []
        },
        {
            "id": "cf_art208_inc3", "tipo": "inciso", "rotulo": "III -", "rubrica": None, "pai": "cf_art208",
            "temas": ["AEE", "Educação Especial"],
            "versoes": build_versao("atendimento educacional especializado aos portadores de deficiência, preferencialmente na rede regular de ensino;"),
            "observacoes": []
        }
    ]
    salvar_norma(cf_caminho, cf_meta, cf_estrutura, cf_dispositivos)


    # =========================================================================
    # 4. DECRETO Nº 7.611/2011 (EDUCAÇÃO ESPECIAL E AEE)
    # =========================================================================
    dec7611_caminho = "br/federal/decreto/2011-7611"
    dec7611_meta = {
        "urn": "urn:lex:br:federal:decreto:2011-11-17;7611",
        "nome": "Decreto nº 7.611/2011 - Educação Especial e AEE",
        "sigla": "Decreto 7.611",
        "ano": 2011,
        "ementa": "Dispõe sobre a educação especial, o atendimento educacional especializado e dá outras providências.",
        "dataPublicacao": "2011-11-18",
        "fonte": "planalto",
        "urlFonte": "https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/decreto/d7611.htm",
        "capturadoEm": "2026-09-22",
        "temas": ["AEE", "Acessibilidade e Tecnologia Assistiva", "Adaptação Curricular & PEI"]
    }
    indice.append({
        "urn": dec7611_meta["urn"],
        "nome": dec7611_meta["nome"],
        "sigla": dec7611_meta["sigla"],
        "ano": dec7611_meta["ano"],
        "caminho": dec7611_caminho,
        "temas": dec7611_meta["temas"]
    })

    dec7611_estrutura = [
        {
            "tipo": "capitulo",
            "rotulo": "CAPÍTULO I",
            "rubrica": "DAS DIRETRIZES E OBJETIVOS DA EDUCAÇÃO ESPECIAL",
            "filhos": [
                {"tipo": "artigo", "rotulo": "Art. 1º", "rubrica": None, "id": "dec7611_art1", "filhos": []},
                {"tipo": "artigo", "rotulo": "Art. 2º", "rubrica": None, "id": "dec7611_art2", "filhos": []},
                {"tipo": "artigo", "rotulo": "Art. 3º", "rubrica": None, "id": "dec7611_art3", "filhos": []},
                {"tipo": "artigo", "rotulo": "Art. 5º", "rubrica": None, "id": "dec7611_art5", "filhos": []}
            ]
        }
    ]

    dec7611_dispositivos = [
        # Art. 1º
        {
            "id": "dec7611_art1", "tipo": "artigo", "rotulo": "Art. 1º", "rubrica": None, "pai": None,
            "temas": ["AEE", "Educação Especial"],
            "versoes": build_versao("O dever do Estado com a educação das pessoas público-alvo da educação especial será efetivado de acordo com os seguintes objetivos:"),
            "observacoes": []
        },
        {
            "id": "dec7611_art1_inc1", "tipo": "inciso", "rotulo": "I -", "rubrica": None, "pai": "dec7611_art1",
            "temas": ["Adaptação Curricular & PEI"],
            "versoes": build_versao("garantia de um sistema educacional inclusivo em todos os níveis, sem discriminação e com base na igualdade de oportunidades;"),
            "observacoes": []
        },
        {
            "id": "dec7611_art1_inc2", "tipo": "inciso", "rotulo": "II -", "rubrica": None, "pai": "dec7611_art1",
            "temas": ["Adaptação Curricular & PEI"],
            "versoes": build_versao("aprendizado ao longo de toda a vida;"),
            "observacoes": []
        },
        {
            "id": "dec7611_art1_inc3", "tipo": "inciso", "rotulo": "III -", "rubrica": None, "pai": "dec7611_art1",
            "temas": ["Adaptação Curricular & PEI"],
            "versoes": build_versao("máximo desenvolvimento possível da personalidade, dos talentos e da criatividade, assim como das habilidades físicas e intelectuais das pessoas com deficiência;"),
            "observacoes": []
        },
        {
            "id": "dec7611_art1_inc4", "tipo": "inciso", "rotulo": "IV -", "rubrica": None, "pai": "dec7611_art1",
            "temas": ["Adaptação Curricular & PEI"],
            "versoes": build_versao("aprimoramento dos sistemas de ensino para garantir condições de acesso, participação e aprendizagem dos estudantes público-alvo da educação especial;"),
            "observacoes": []
        },
        {
            "id": "dec7611_art1_inc8", "tipo": "inciso", "rotulo": "VIII -", "rubrica": None, "pai": "dec7611_art1",
            "temas": ["AEE", "Acessibilidade e Tecnologia Assistiva"],
            "versoes": build_versao("oferta de atendimento educacional especializado; e"),
            "observacoes": []
        },
        # Art. 2º
        {
            "id": "dec7611_art2", "tipo": "artigo", "rotulo": "Art. 2º", "rubrica": None, "pai": None,
            "temas": ["AEE"],
            "versoes": build_versao("A educação especial deve garantir os serviços de apoio especializado voltados a eliminar as barreiras que possam obstar o processo de escolarização de estudantes público-alvo da educação especial."),
            "observacoes": []
        },
        {
            "id": "dec7611_art2_par1", "tipo": "paragrafo", "rotulo": "§ 1º", "rubrica": None, "pai": "dec7611_art2",
            "temas": ["AEE"],
            "versoes": build_versao("Para fins deste Decreto, aos serviços de apoio especializado denominam-se atendimento educacional especializado, compreendido como o conjunto de atividades, recursos de acessibilidade e pedagógicos organizados institucional e continuamente, prestado de forma suplementar à formação de estudantes com deficiência e transtornos globais do desenvolvimento, ou de forma complementar à formação de estudantes com altas habilidades ou superdotação."),
            "observacoes": []
        },
        {
            "id": "dec7611_art2_par2", "tipo": "paragrafo", "rotulo": "§ 2º", "rubrica": None, "pai": "dec7611_art2",
            "temas": ["AEE"],
            "versoes": build_versao("O atendimento educacional especializado deve integrar a proposta pedagógica da escola, envolver a participação da família para garantir pleno acesso e articulação com os demais serviços de educação e da saúde, assistência social e direitos humanos."),
            "observacoes": []
        },
        # Art. 3º
        {
            "id": "dec7611_art3", "tipo": "artigo", "rotulo": "Art. 3º", "rubrica": None, "pai": None,
            "temas": ["AEE", "Acessibilidade e Tecnologia Assistiva"],
            "versoes": build_versao("São objetivos do atendimento educacional especializado:"),
            "observacoes": []
        },
        {
            "id": "dec7611_art3_inc1", "tipo": "inciso", "rotulo": "I -", "rubrica": None, "pai": "dec7611_art3",
            "temas": ["AEE"],
            "versoes": build_versao("prover condições de acesso, participação e aprendizagem no ensino regular e garantir serviços de apoio especializados de acordo com as necessidades individuais dos estudantes;"),
            "observacoes": []
        },
        {
            "id": "dec7611_art3_inc2", "tipo": "inciso", "rotulo": "II -", "rubrica": None, "pai": "dec7611_art3",
            "temas": ["AEE"],
            "versoes": build_versao("garantir a transversalidade das ações da educação especial no ensino regular;"),
            "observacoes": []
        },
        {
            "id": "dec7611_art3_inc3", "tipo": "inciso", "rotulo": "III -", "rubrica": None, "pai": "dec7611_art3",
            "temas": ["Adaptação Curricular & PEI", "AEE"],
            "versoes": build_versao("fomentar o desenvolvimento de recursos didáticos e pedagógicos que eliminem as barreiras no processo de ensino e aprendizagem; e"),
            "observacoes": []
        },
        {
            "id": "dec7611_art3_inc4", "tipo": "inciso", "rotulo": "IV -", "rubrica": None, "pai": "dec7611_art3",
            "temas": ["AEE"],
            "versoes": build_versao("assegurar condições para a continuidade dos estudos nos demais níveis, etapas e modalidades de ensino."),
            "observacoes": []
        },
        # Art. 5º (Salas de Recursos Multifuncionais)
        {
            "id": "dec7611_art5", "tipo": "artigo", "rotulo": "Art. 5º", "rubrica": None, "pai": None,
            "temas": ["AEE", "Acessibilidade e Tecnologia Assistiva"],
            "versoes": build_versao("A União prestará apoio técnico e financeiro aos sistemas públicos de ensino dos Estados, Municípios e Distrito Federal, e a instituições comunitárias, confessionais ou filantrópicas sem fins lucrativos, com a finalidade de ampliar a oferta do atendimento educacional especializado aos estudantes público-alvo da educação especial, mediante ações prioritárias de:"),
            "observacoes": []
        },
        {
            "id": "dec7611_art5_inc1", "tipo": "inciso", "rotulo": "I -", "rubrica": None, "pai": "dec7611_art5",
            "temas": ["AEE", "Acessibilidade e Tecnologia Assistiva"],
            "versoes": build_versao("implantação de salas de recursos multifuncionais;"),
            "observacoes": []
        },
        {
            "id": "dec7611_art5_inc2", "tipo": "inciso", "rotulo": "II -", "rubrica": None, "pai": "dec7611_art5",
            "temas": ["AEE", "Profissional de Apoio"],
            "versoes": build_versao("formação continuada de professores para o atendimento educacional especializado;"),
            "observacoes": []
        },
        {
            "id": "dec7611_art5_inc3", "tipo": "inciso", "rotulo": "III -", "rubrica": None, "pai": "dec7611_art5",
            "temas": ["Acessibilidade e Tecnologia Assistiva"],
            "versoes": build_versao("adequação arquitetônica de prédios escolares para acessibilidade;"),
            "observacoes": []
        }
    ]
    salvar_norma(dec7611_caminho, dec7611_meta, dec7611_estrutura, dec7611_dispositivos)


    # =========================================================================
    # 5. LEI BERENICE PIANA - LEI Nº 12.764/2012 (DIREITOS DA PESSOA COM TEA)
    # =========================================================================
    tea_caminho = "br/federal/lei/2012-12764"
    tea_meta = {
        "urn": "urn:lex:br:federal:lei:2012-12-27;12764",
        "nome": "Lei Berenice Piana (Política Nacional de Proteção à Pessoa com TEA)",
        "sigla": "Lei Berenice Piana",
        "ano": 2012,
        "ementa": "Institui a Política Nacional de Proteção dos Direitos da Pessoa com Transtorno do Espectro Autista; e altera o § 3º do art. 98 da Lei nº 8.112, de 11 de dezembro de 1990.",
        "dataPublicacao": "2012-12-28",
        "fonte": "planalto",
        "urlFonte": "https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2012/lei/l12764.htm",
        "capturadoEm": "2026-09-22",
        "temas": ["TEA", "Profissional de Apoio", "Direito e Não Discriminação", "AEE"]
    }
    indice.append({
        "urn": tea_meta["urn"],
        "nome": tea_meta["nome"],
        "sigla": tea_meta["sigla"],
        "ano": tea_meta["ano"],
        "caminho": tea_caminho,
        "temas": tea_meta["temas"]
    })

    tea_estrutura = [
        {
            "tipo": "capitulo",
            "rotulo": "CAPÍTULO I",
            "rubrica": "DISPOSIÇÕES PRELIMINARES",
            "filhos": [
                {"tipo": "artigo", "rotulo": "Art. 1º", "rubrica": None, "id": "tea_art1", "filhos": []},
                {"tipo": "artigo", "rotulo": "Art. 2º", "rubrica": None, "id": "tea_art2", "filhos": []},
                {"tipo": "artigo", "rotulo": "Art. 3º", "rubrica": None, "id": "tea_art3", "filhos": []},
                {"tipo": "artigo", "rotulo": "Art. 7º", "rubrica": None, "id": "tea_art7", "filhos": []}
            ]
        }
    ]

    tea_dispositivos = [
        # Art. 1º
        {
            "id": "tea_art1", "tipo": "artigo", "rotulo": "Art. 1º", "rubrica": None, "pai": None,
            "temas": ["TEA"],
            "versoes": build_versao("Esta Lei institui a Política Nacional de Proteção dos Direitos da Pessoa com Transtorno do Espectro Autista e estabelece diretrizes para sua consecução."),
            "observacoes": []
        },
        {
            "id": "tea_art1_par1", "tipo": "paragrafo", "rotulo": "§ 1º", "rubrica": None, "pai": "tea_art1",
            "temas": ["TEA"],
            "versoes": build_versao("Para os efeitos desta Lei, é considerada pessoa com transtorno do espectro autista aquela portadora de síndrome clínica caracterizada na forma dos seguintes incisos:"),
            "observacoes": []
        },
        {
            "id": "tea_art1_par1_inc1", "tipo": "inciso", "rotulo": "I -", "rubrica": None, "pai": "tea_art1_par1",
            "temas": ["TEA"],
            "versoes": build_versao("deficiência persistente e clinicamente significativa da comunicação e da interação sociais, manifestada por deficiência marcada de comunicação verbal e não verbal usada para interação social; ausência de reciprocidade social; falência em desenvolver e manter relações apropriadas ao seu nível de desenvolvimento;"),
            "observacoes": []
        },
        {
            "id": "tea_art1_par1_inc2", "tipo": "inciso", "rotulo": "II -", "rubrica": None, "pai": "tea_art1_par1",
            "temas": ["TEA"],
            "versoes": build_versao("padrões restritivos e repetitivos de comportamentos, interesses e atividades, manifestados por comportamentos motores ou verbais estereotipados ou por comportamentos sensoriais incomuns; excessiva aderência a rotinas e padrões de comportamento ritualizados; interesses restritos e fixos."),
            "observacoes": []
        },
        {
            "id": "tea_art1_par2", "tipo": "paragrafo", "rotulo": "§ 2º", "rubrica": None, "pai": "tea_art1",
            "temas": ["TEA", "Direito e Não Discriminação"],
            "versoes": build_versao("A pessoa com transtorno do espectro autista é considerada pessoa com deficiência, para todos os efeitos legais."),
            "observacoes": []
        },
        # Art. 2º
        {
            "id": "tea_art2", "tipo": "artigo", "rotulo": "Art. 2º", "rubrica": None, "pai": None,
            "temas": ["TEA", "Adaptação Curricular & PEI"],
            "versoes": build_versao("São diretrizes da Política Nacional de Proteção dos Direitos da Pessoa com Transtorno do Espectro Autista:"),
            "observacoes": []
        },
        {
            "id": "tea_art2_inc1", "tipo": "inciso", "rotulo": "I -", "rubrica": None, "pai": "tea_art2",
            "temas": ["TEA", "AEE"],
            "versoes": build_versao("a intersetorialidade no desenvolvimento das ações e das políticas e no atendimento à pessoa com transtorno do espectro autista;"),
            "observacoes": []
        },
        {
            "id": "tea_art2_inc2", "tipo": "inciso", "rotulo": "II -", "rubrica": None, "pai": "tea_art2",
            "temas": ["TEA"],
            "versoes": build_versao("a participação da comunidade na formulação de políticas públicas voltadas para as pessoas com transtorno do espectro autista e o controle social da sua implantação, acompanhamento e avaliação;"),
            "observacoes": []
        },
        {
            "id": "tea_art2_inc7", "tipo": "inciso", "rotulo": "VII -", "rubrica": None, "pai": "tea_art2",
            "temas": ["TEA", "Adaptação Curricular & PEI"],
            "versoes": build_versao("o incentivo à formação e à capacitação de profissionais especializados no atendimento à pessoa com transtorno do espectro autista, bem como a pais e responsáveis;"),
            "observacoes": []
        },
        # Art. 3º (Direito ao acompanhante especializado em sala de aula)
        {
            "id": "tea_art3", "tipo": "artigo", "rotulo": "Art. 3º", "rubrica": None, "pai": None,
            "temas": ["TEA", "Profissional de Apoio", "Direito e Não Discriminação"],
            "versoes": build_versao("São direitos da pessoa com transtorno do espectro autista:"),
            "observacoes": []
        },
        {
            "id": "tea_art3_inc4", "tipo": "inciso", "rotulo": "IV -", "rubrica": None, "pai": "tea_art3",
            "temas": ["TEA", "Direito e Não Discriminação"],
            "versoes": build_versao("o acesso: a) à educação e ao ensino profissionalizante;"),
            "observacoes": []
        },
        {
            "id": "tea_art3_paru", "tipo": "paragrafo", "rotulo": "Parágrafo único", "rubrica": None, "pai": "tea_art3",
            "temas": ["TEA", "Profissional de Apoio", "AEE"],
            "versoes": build_versao("Em casos de comprovada necessidade, a pessoa com transtorno do espectro autista incluída nas classes comuns de ensino regular, nos termos do inciso IV do art. 2º, terá direito a acompanhante especializado."),
            "observacoes": []
        },
        # Art. 7º (Punição para recusa de matrícula)
        {
            "id": "tea_art7", "tipo": "artigo", "rotulo": "Art. 7º", "rubrica": None, "pai": None,
            "temas": ["TEA", "Direito e Não Discriminação"],
            "versoes": build_versao("O gestor escolar, ou autoridade competente, que recusar a matrícula de aluno com transtorno do espectro autista, ou qualquer outro tipo de deficiência, será punido com multa de 3 (três) a 20 (vinte) salários-mínimos."),
            "observacoes": []
        },
        {
            "id": "tea_art7_par1", "tipo": "paragrafo", "rotulo": "§ 1º", "rubrica": None, "pai": "tea_art7",
            "temas": ["TEA", "Direito e Não Discriminação"],
            "versoes": build_versao("Em caso de reincidência, apurada por processo administrativo, assegurado o contraditório e a ampla defesa, haverá a perda do cargo."),
            "observacoes": []
        }
    ]
    salvar_norma(tea_caminho, tea_meta, tea_estrutura, tea_dispositivos)


    # =========================================================================
    # 6. CONVENÇÃO DA ONU SOBRE DIREITOS DA PCD - ART. 24 (DECRETO 6.949/2009)
    # =========================================================================
    cdpd_caminho = "br/federal/decreto/2009-6949-art24"
    cdpd_meta = {
        "urn": "urn:lex:br:federal:decreto:2009-08-25;6949",
        "nome": "Convenção da ONU sobre Direitos da PcD - Artigo 24 (Educação)",
        "sigla": "CDPD/ONU (Art. 24)",
        "ano": 2009,
        "ementa": "Promulga a Convenção Internacional sobre os Direitos das Pessoas com Deficiência e seu Protocolo Facultativo. Artigo 24 - Educação.",
        "dataPublicacao": "2009-08-26",
        "fonte": "planalto",
        "urlFonte": "https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2009/decreto/d6949.htm",
        "capturadoEm": "2026-09-22",
        "temas": ["Direito e Não Discriminação", "AEE", "Adaptação Curricular & PEI", "Libras e Bilinguismo"]
    }
    indice.append({
        "urn": cdpd_meta["urn"],
        "nome": cdpd_meta["nome"],
        "sigla": cdpd_meta["sigla"],
        "ano": cdpd_meta["ano"],
        "caminho": cdpd_caminho,
        "temas": cdpd_meta["temas"]
    })

    cdpd_estrutura = [
        {
            "tipo": "capitulo",
            "rotulo": "CONVENÇÃO DA ONU",
            "rubrica": "STATUS CONSTITUCIONAL (EMENDA À CF/88)",
            "filhos": [
                {"tipo": "artigo", "rotulo": "Artigo 24", "rubrica": "Educação", "id": "cdpd_art24", "filhos": []}
            ]
        }
    ]

    cdpd_dispositivos = [
        {
            "id": "cdpd_art24", "tipo": "artigo", "rotulo": "Artigo 24", "rubrica": "Educação", "pai": None,
            "temas": ["Direito e Não Discriminação", "AEE", "Adaptação Curricular & PEI"],
            "versoes": build_versao("1. Os Estados Partes reconhecem o direito das pessoas com deficiência à educação. Para efetivar esse direito sem discriminação e com base na igualdade de oportunidades, os Estados Partes assegurarão sistema educacional inclusivo em todos os níveis, bem como o aprendizado ao longo de toda a vida, com os seguintes objetivos: a) O pleno desenvolvimento do potencial humano e do senso de dignidade e auto-estima, além do fortalecimento do respeito pelos direitos humanos, pelas liberdades fundamentais e pela diversidade humana; b) O máximo desenvolvimento possível da personalidade, dos talentos e da criatividade das pessoas com deficiência, assim como de suas habilidades físicas e intelectuais; c) A participação efetiva das pessoas com deficiência em uma sociedade livre."),
            "observacoes": []
        },
        {
            "id": "cdpd_art24_item2", "tipo": "paragrafo", "rotulo": "Item 2", "rubrica": None, "pai": "cdpd_art24",
            "temas": ["Direito e Não Discriminação", "Adaptação Curricular & PEI"],
            "versoes": build_versao("2. Para a realização desse direito, os Estados Partes assegurarão que: a) As pessoas com deficiência não sejam excluídas do sistema educacional geral sob alegação de deficiência e que as crianças com deficiência não sejam excluídas do ensino primário gratuito e compulsório ou do ensino secundário, sob alegação de deficiência; b) As pessoas com deficiência possam ter acesso ao ensino primário inclusivo, de qualidade e gratuito, e ao ensino secundário, em igualdade de condições com as demais pessoas na comunidade em que vivem; c) Adaptações razoáveis de acordo com as necessidades individuais sejam providenciadas; d) As pessoas com deficiência recebam o apoio necessário, no âmbito do sistema educacional geral, com vistas a facilitar sua efetiva educação; e) Medidas de apoio individualizadas e efetivas sejam adotadas em ambientes que maximizem o desenvolvimento acadêmico e social, de acordo com a meta de inclusão plena."),
            "observacoes": []
        },
        {
            "id": "cdpd_art24_item3", "tipo": "paragrafo", "rotulo": "Item 3", "rubrica": None, "pai": "cdpd_art24",
            "temas": ["Libras e Bilinguismo", "Acessibilidade e Tecnologia Assistiva"],
            "versoes": build_versao("3. Os Estados Partes assegurarão às pessoas com deficiência a possibilidade de aprender habilidades de vida e de desenvolvimento social, a fim de facilitar sua plena e igual participação na educação e como membros da comunidade. Para tanto, os Estados Partes tomarão medidas apropriadas, incluindo: a) Facilitação do aprendizado do braille, escrita alternativa, modos, meios e formatos de comunicação aumentativa e alternativa, e habilidades de orientação e mobilidade, além de facilitação do apoio e aconselhamento de pares; b) Facilitação do aprendizado da língua de sinais e promoção da identidade linguística da comunidade surda; c) Garantia de que a educação de pessoas, inclusive crianças cegas, surdocegas e surdas, seja ministrada nas línguas e nos modos e meios de comunicação mais adequados ao indivíduo e em ambientes que favoreçam ao máximo seu desenvolvimento acadêmico e social."),
            "observacoes": []
        },
        {
            "id": "cdpd_art24_item4", "tipo": "paragrafo", "rotulo": "Item 4", "rubrica": None, "pai": "cdpd_art24",
            "temas": ["Profissional de Apoio", "Libras e Bilinguismo"],
            "versoes": build_versao("4. A fim de contribuir para a realização desse direito, os Estados Partes tomarão medidas apropriadas para empregar professores, inclusive professores com deficiência, habilitados para o ensino da língua de sinais e/ou do braille, e para capacitar profissionais e equipes atuantes em todos os níveis do ensino. Essa capacitação incorporará a conscientização da deficiência e o uso de modos, meios e formatos apropriados de comunicação aumentativa e alternativa, técnicas e materiais pedagógicos, para atender a pessoas com deficiência."),
            "observacoes": []
        }
    ]
    salvar_norma(cdpd_caminho, cdpd_meta, cdpd_estrutura, cdpd_dispositivos)


    # =========================================================================
    # 7. RESOLUÇÃO CNE/CEB Nº 4/2009 (DIRETRIZES OPERACIONAIS PARA O AEE)
    # =========================================================================
    cne_caminho = "br/federal/resolucao-cne/2009-4"
    cne_meta = {
        "urn": "urn:lex:br:conselho.nacional.educacao;camara.educacao.basica:resolucao:2009-10-02;4",
        "nome": "Resolução CNE/CEB nº 4/2009 - Diretrizes Operacionais para o AEE",
        "sigla": "Resolução CNE/CEB 4/2009",
        "ano": 2009,
        "ementa": "Institui Diretrizes Operacionais para o Atendimento Educacional Especializado na Educação Básica, modalidade Educação Especial.",
        "dataPublicacao": "2009-10-05",
        "fonte": "mec_cne",
        "urlFonte": "http://portal.mec.gov.br/dmdocuments/rceb004_09.pdf",
        "capturadoEm": "2026-09-22",
        "temas": ["AEE", "Adaptação Curricular & PEI", "Acessibilidade e Tecnologia Assistiva"]
    }
    indice.append({
        "urn": cne_meta["urn"],
        "nome": cne_meta["nome"],
        "sigla": cne_meta["sigla"],
        "ano": cne_meta["ano"],
        "caminho": cne_caminho,
        "temas": cne_meta["temas"]
    })

    cne_estrutura = [
        {
            "tipo": "capitulo",
            "rotulo": "DIRETRIZES OPERACIONAIS",
            "rubrica": "ATENDIMENTO EDUCACIONAL ESPECIALIZADO",
            "filhos": [
                {"tipo": "artigo", "rotulo": "Art. 1º", "rubrica": None, "id": "cne_art1", "filhos": []},
                {"tipo": "artigo", "rotulo": "Art. 2º", "rubrica": None, "id": "cne_art2", "filhos": []},
                {"tipo": "artigo", "rotulo": "Art. 4º", "rubrica": "Público-alvo do AEE", "id": "cne_art4", "filhos": []},
                {"tipo": "artigo", "rotulo": "Art. 5º", "rubrica": "Salas de Recursos Multifuncionais", "id": "cne_art5", "filhos": []},
                {"tipo": "artigo", "rotulo": "Art. 9º", "rubrica": "Plano de AEE", "id": "cne_art9", "filhos": []},
                {"tipo": "artigo", "rotulo": "Art. 12", "rubrica": "Docência do AEE", "id": "cne_art12", "filhos": []}
            ]
        }
    ]

    cne_dispositivos = [
        {
            "id": "cne_art1", "tipo": "artigo", "rotulo": "Art. 1º", "rubrica": None, "pai": None,
            "temas": ["AEE", "Educação Especial"],
            "versoes": build_versao("Para a implementação do Decreto nº 6.571/2008 (sucedido pelo Dec. 7.611/2011), os sistemas de ensino devem matricular os estudantes com deficiência, transtornos globais do desenvolvimento e altas habilidades/superdotação nas classes comuns do ensino regular e no Atendimento Educacional Especializado (AEE), ofertado em salas de recursos multifuncionais ou em centros de AEE da rede pública ou de instituições comunitárias, confessionais ou filantrópicas sem fins lucrativos."),
            "observacoes": []
        },
        {
            "id": "cne_art2", "tipo": "artigo", "rotulo": "Art. 2º", "rubrica": None, "pai": None,
            "temas": ["AEE"],
            "versoes": build_versao("O AEE tem como função complementar ou suplementar a formação do aluno por meio da disponibilização de serviços, recursos de acessibilidade e estratégias que eliminem as barreiras para sua plena participação na sociedade e desenvolvimento de sua aprendizagem."),
            "observacoes": []
        },
        {
            "id": "cne_art2_paru", "tipo": "paragrafo", "rotulo": "Parágrafo único", "rubrica": None, "pai": "cne_art2",
            "temas": ["AEE"],
            "versoes": build_versao("Para fins destas Diretrizes, os serviços de AEE não substituem a escolarização na classe comum do ensino regular."),
            "observacoes": []
        },
        {
            "id": "cne_art4", "tipo": "artigo", "rotulo": "Art. 4º", "rubrica": "Público-alvo do AEE", "pai": None,
            "temas": ["AEE", "TEA"],
            "versoes": build_versao("Para efeito destas Diretrizes, considera-se público-alvo do AEE: I - Alunos com deficiência: aqueles que têm impedimentos de longo prazo de natureza física, intelectual, mental ou sensorial; II - Alunos com transtornos globais do desenvolvimento: aqueles que apresentam um quadro de alterações no desenvolvimento neuropsicomotor, comprometimento nas relações sociais, na comunicação ou estereotipias motoras. Incluem-se nessa definição alunos com autismo clássico, síndrome de Asperger, síndrome de Rett, transtorno desintegrativo da infância e transtornos invasivos sem outra especificação; III - Alunos com altas habilidades/superdotação: aqueles que apresentam um potencial elevado e grande envolvimento com as áreas do conhecimento humano, isoladas ou combinadas."),
            "observacoes": []
        },
        {
            "id": "cne_art5", "tipo": "artigo", "rotulo": "Art. 5º", "rubrica": "Salas de Recursos Multifuncionais", "pai": None,
            "temas": ["AEE", "Acessibilidade e Tecnologia Assistiva"],
            "versoes": build_versao("O AEE é realizado, prioritariamente, na sala de recursos multifuncionais da própria escola ou em outra escola de ensino regular, no turno inverso da escolarização, não sendo substitutivo às classes comuns, podendo ser realizado, também, em centro de Atendimento Educacional Especializado da rede pública ou de instituições comunitárias, confessionais ou filantrópicas sem fins lucrativos, conveniadas com a Secretaria de Educação."),
            "observacoes": []
        },
        {
            "id": "cne_art9", "tipo": "artigo", "rotulo": "Art. 9º", "rubrica": "Plano de AEE", "pai": None,
            "temas": ["AEE", "Adaptação Curricular & PEI"],
            "versoes": build_versao("A elaboração e a execução do plano de AEE são de competência dos professores que atuam na sala de recursos multifuncionais ou centros de AEE, em articulação com os demais professores do ensino regular, com a participação das famílias e em interface com os demais serviços setoriais da saúde, da assistência social, entre outros necessários ao atendimento."),
            "observacoes": []
        },
        {
            "id": "cne_art12", "tipo": "artigo", "rotulo": "Art. 12", "rubrica": "Docência do AEE", "pai": None,
            "temas": ["AEE", "Profissional de Apoio"],
            "versoes": build_versao("Para atuação no AEE, o professor deve ter formação inicial que o habilite para o exercício da docência e formação específica na educação especial, com ênfase no atendimento educacional especializado."),
            "observacoes": []
        }
    ]
    salvar_norma(cne_caminho, cne_meta, cne_estrutura, cne_dispositivos)


    # =========================================================================
    # SALVAR ÍNDICE GERAL
    # =========================================================================
    indice_path = DATA_DIR / "indice.json"
    with open(indice_path, "w", encoding="utf-8") as f:
        json.dump(indice, f, ensure_ascii=False, indent=2)
    print(f"\nSucesso: indice.json gravado com {len(indice)} normas em {indice_path}!")

if __name__ == "__main__":
    gerar_corpus()
