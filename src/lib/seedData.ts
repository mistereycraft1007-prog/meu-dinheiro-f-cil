import { localDb } from "./localDb";

// Dados da planilha Excel
const excelData = [
  { nome: "Acreano", emprestimo: 1000, dataEmprestimo: "2025-05-08", aPagar: 1200, dataPagar: "2025-05-12", status: "Aberto" },
  { nome: "Tayna Acreana", emprestimo: 500, dataEmprestimo: "2025-05-08", aPagar: 600, dataPagar: "2025-05-09", status: "Pago" },
  { nome: "Luiz Eduardo", emprestimo: 1000, dataEmprestimo: "2025-05-08", aPagar: 1500, dataPagar: "2025-08-23", status: "Pago" },
  { nome: "Joice Melo", emprestimo: 200, dataEmprestimo: "2025-06-08", aPagar: 250, dataPagar: "2025-09-21", status: "Pago" },
  { nome: "Bruno Marciano", emprestimo: 262, dataEmprestimo: "2025-06-08", aPagar: 787, dataPagar: "2025-10-05", status: "Pago" },
  { nome: "Hilton", emprestimo: 1000, dataEmprestimo: "2025-08-08", aPagar: 1250, dataPagar: "2025-11-05", status: "Aberto" },
  { nome: "Juliana Garcia", emprestimo: 500, dataEmprestimo: "2025-08-11", aPagar: 625, dataPagar: "2025-08-15", status: "Pago" },
  { nome: "Junior Irmão do Jeferson", emprestimo: 250, dataEmprestimo: "2025-08-12", aPagar: 312, dataPagar: "2025-09-12", status: "Pago" },
  { nome: "Gilmar Marido da Juh", emprestimo: 500, dataEmprestimo: "2025-08-19", aPagar: 625, dataPagar: "2025-09-19", status: "Pago" },
  { nome: "Luiz Eduardo", emprestimo: 550, dataEmprestimo: "2025-08-25", aPagar: 715, dataPagar: "2025-09-25", status: "Pago" },
  { nome: "Elielma", emprestimo: 250, dataEmprestimo: "2025-08-28", aPagar: 300, dataPagar: "2025-09-15", status: "Pago" },
  { nome: "Edi Lopes", emprestimo: 1000, dataEmprestimo: "2025-08-29", aPagar: 1200, dataPagar: "2025-11-29", status: "Aberto" },
  { nome: "Edi Lopes", emprestimo: 2000, dataEmprestimo: "2025-10-08", aPagar: 2400, dataPagar: "2025-12-08", status: "Aberto" },
  { nome: "Tayna Acreana", emprestimo: 500, dataEmprestimo: "2025-08-29", aPagar: 600, dataPagar: "2025-09-29", status: "Pago" },
  { nome: "Denis Barbeiro", emprestimo: 3000, dataEmprestimo: "2025-09-09", aPagar: 3600, dataPagar: "2025-12-09", status: "Aberto" },
  { nome: "Regina Preventiva", emprestimo: 500, dataEmprestimo: "2025-09-05", aPagar: 800, dataPagar: "2025-10-15", status: "Pago" },
  { nome: "Regina Preventiva", emprestimo: 500, dataEmprestimo: "2025-09-05", aPagar: 800, dataPagar: "2025-11-05", status: "Pago" },
  { nome: "Regina Preventiva", emprestimo: 500, dataEmprestimo: "2025-09-05", aPagar: 800, dataPagar: "2025-12-05", status: "Pago" },
  { nome: "Elly", emprestimo: 600, dataEmprestimo: "2025-09-18", aPagar: 750, dataPagar: "2025-11-18", status: "Aberto" },
  { nome: "Gilmar Marido da Juh", emprestimo: 1000, dataEmprestimo: "2025-09-18", aPagar: 1300, dataPagar: "2025-10-20", status: "Pago" },
  { nome: "Gilmar Marido da Juh", emprestimo: 1000, dataEmprestimo: "2025-09-18", aPagar: 1600, dataPagar: "2025-11-20", status: "Pago" },
  { nome: "Tayna Acreana", emprestimo: 500, dataEmprestimo: "2025-10-02", aPagar: 600, dataPagar: "2025-11-01", status: "Pago" },
  { nome: "Paraiba", emprestimo: 200, dataEmprestimo: "2025-10-08", aPagar: 240, dataPagar: "2025-11-08", status: "Aberto" },
  { nome: "Gilmar Marido da Juh", emprestimo: 2000, dataEmprestimo: "2025-10-20", aPagar: 2600, dataPagar: "2025-11-20", status: "Pago" },
  { nome: "Joice Melo", emprestimo: 200, dataEmprestimo: "2025-09-23", aPagar: 250, dataPagar: "2025-10-23", status: "Pago" },
  { nome: "Junior Irmão do Jeferson", emprestimo: 300, dataEmprestimo: "2025-10-23", aPagar: 375, dataPagar: "2025-11-23", status: "Pago" },
  { nome: "Tayna Acreana", emprestimo: 500, dataEmprestimo: "2025-10-31", aPagar: 600, dataPagar: "2025-12-01", status: "Pago" },
  { nome: "Luiz Eduardo", emprestimo: 250, dataEmprestimo: "2025-09-30", aPagar: 350, dataPagar: "2025-10-30", status: "Pago" },
  { nome: "Elielma", emprestimo: 500, dataEmprestimo: "2025-09-30", aPagar: 600, dataPagar: "2025-10-30", status: "Pago" },
  { nome: "Netim mago", emprestimo: 200, dataEmprestimo: "2025-11-01", aPagar: 250, dataPagar: "2025-11-30", status: "Aberto" },
  { nome: "Luiz Eduardo", emprestimo: 500, dataEmprestimo: "2025-11-05", aPagar: 650, dataPagar: "2025-12-05", status: "Aberto" },
  { nome: "Junior Irmão do Jeferson", emprestimo: 320, dataEmprestimo: "2025-11-28", aPagar: 400, dataPagar: "2025-12-28", status: "Aberto" },
];

export const importExcelData = () => {
  const existingLoans = localDb.getLoans();
  
  // Verifica se já tem dados importados
  if (existingLoans.length > 0) {
    const confirmImport = window.confirm(
      `Já existem ${existingLoans.length} empréstimos cadastrados.\n\nDeseja ADICIONAR os 31 empréstimos da planilha aos dados existentes?`
    );
    if (!confirmImport) return false;
  }

  let imported = 0;
  
  excelData.forEach((item) => {
    try {
      localDb.addLoan({
        person_name: item.nome,
        loan_amount: item.emprestimo,
        loan_date: item.dataEmprestimo,
        amount_to_pay: item.aPagar,
        due_date: item.dataPagar,
        status: item.status,
      });
      imported++;
    } catch (error) {
      console.error("Erro ao importar:", item.nome, error);
    }
  });

  return imported;
};

export const clearAllData = () => {
  if (window.confirm("⚠️ ATENÇÃO: Isso irá APAGAR TODOS os empréstimos!\n\nTem certeza?")) {
    localStorage.removeItem('loans_db');
    return true;
  }
  return false;
};
