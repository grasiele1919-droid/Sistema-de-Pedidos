import { useState } from 'react';

export function useCarrinho() {
  const [itens, setItens] = useState([]);

  function adicionar(produto) {
    setItens((atuais) => {
      const existe = atuais.some((item) => item.produto.id === produto.id);
      if (!existe) return [...atuais, { produto, quantidade: 1 }];
      return atuais.map((item) =>
        item.produto.id === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item,
      );
    });
  }

  function remover(produtoId) {
    setItens((atuais) =>
      atuais
        .map((item) =>
          item.produto.id === produtoId ? { ...item, quantidade: item.quantidade - 1 } : item,
        )
        .filter((item) => item.quantidade > 0),
    );
  }

  function limpar() {
    setItens([]);
  }

  function quantidadeDe(produtoId) {
    return itens.find((item) => item.produto.id === produtoId)?.quantidade ?? 0;
  }

  const quantidadeTotal = itens.reduce((soma, item) => soma + item.quantidade, 0);
  const total = itens.reduce((soma, item) => soma + item.produto.preco * item.quantidade, 0);

  return { itens, adicionar, remover, limpar, quantidadeDe, quantidadeTotal, total };
}
