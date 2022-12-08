//
//  ViewController.swift
//  Contato
//
//  Created by COTEMIG on 11/08/22.
//

import UIKit

struct Contato {
    let nome: String
    let telefone: String
    let email: String
    let endereco: String
}

class ViewController: UIViewController, UITableViewDataSource {
    
    var listaDeContatos:[Contato] = []
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return listaDeContatos.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "MinhaCelula", for: indexPath) as! MyCell
        let contato = listaDeContatos[indexPath.row]
        
        cell.nome.text = contato.nome
        cell.telefone.text = contato.telefone
        cell.email.text = contato.email
        cell.endereco.text = contato.endereco
        
        return cell
    }
      
    
    @IBOutlet weak var tableView: UITableView!

    override func viewDidLoad() {
        super.viewDidLoad()
        
        tableView.dataSource = self
        
        listaDeContatos.append(Contato(nome:"Contato 1", telefone:"31 98989-0000", email:"contato1@email.com.br", endereco:"Rua Cristal, 11"))
        
        listaDeContatos.append(Contato(nome:"Contato 2", telefone:"31 98989-1111", email:"contato2@email.com.br", endereco:"Rua Cristal, 22"))
        
        listaDeContatos.append(Contato(nome:"Contato 3", telefone:"31 98989-2222", email:"contato3@email.com.br", endereco:"Rua Cristal, 33"))
    }


}

