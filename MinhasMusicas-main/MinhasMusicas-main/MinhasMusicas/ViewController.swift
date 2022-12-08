//
//  ViewController.swift
//  MinhasMusicas
//
//  Created by COTEMIG on 18/08/22.
//

import UIKit

struct Musica {
    let nomeMusica: String
    let nomeAlbum: String
    let nomeCantor: String
    let nomeImagemPequena: String
    let nomeImagemGrande: String
}

class ViewController: UIViewController, UITableViewDataSource, UITableViewDelegate {
    
    var listaDeMusicas:[Musica] = []
    
    @IBOutlet weak var tabelView: UITableView!
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return self.listaDeMusicas.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tabelView.dequeueReusableCell(withIdentifier: "MinhaCelula", for: indexPath) as! MyCell
        
        let musica = self.listaDeMusicas[indexPath.row]
        
        cell.musica.text = musica.nomeMusica
        cell.album.text = musica.nomeAlbum
        cell.cantor.text = musica.nomeCantor
        cell.capa.image = UIImage(named: musica.nomeImagemPequena)
        
        return cell
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        self.performSegue(withIdentifier: "abrirDetalhe", sender: indexPath.row)
    }
        
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
       
        let detalhesViewController = segue.destination as! DetalheMusicaViewController
        let indice = sender as! Int
        let musica = self.listaDeMusicas[indice]
        
        detalhesViewController.nomeImagem = musica.nomeImagemGrande
        detalhesViewController.nomeMusica = musica.nomeMusica
        detalhesViewController.nomeAlbum = musica.nomeAlbum
        detalhesViewController.nomeCantor = musica.nomeCantor
    }

    
    override func viewDidLoad() {
        super.viewDidLoad()
           
        tabelView.dataSource = self
        tabelView.delegate = self
        
        self.listaDeMusicas.append(Musica(nomeMusica: "Pontos Cardeais", nomeAlbum: "Álbum Vivo", nomeCantor: "Alceu Valença", nomeImagemPequena: "capa_alceu_pequeno", nomeImagemGrande: "capa_alceu_grande"))
        
        self.listaDeMusicas.append(Musica(nomeMusica: "Menor Abandonado", nomeAlbum: "Álbum Patota de Cosme", nomeCantor: "Zeca Pagodinho", nomeImagemPequena: "capa_zeca_pequeno", nomeImagemGrande: "capa_zeca_grande"))
        
        self.listaDeMusicas.append(Musica(nomeMusica: "Tiro ao Álvaro", nomeAlbum: "Álbum Adoniran Barbosa e Convidados", nomeCantor: "Adoniran Barbosa", nomeImagemPequena: "capa_adoniran_pequeno", nomeImagemGrande: "capa_adhoniran_grande"))    }

}

