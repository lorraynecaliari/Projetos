//
//  DetalheMusicaViewController.swift
//  MinhasMusicas
//
//  Created by COTEMIG on 18/08/22.
//

import UIKit

class DetalheMusicaViewController: UIViewController {
    
    var nomeImagem: String = ""
    var nomeMusica: String = ""
    var nomeAlbum: String = ""
    var nomeCantor: String = ""
    
    @IBOutlet weak var capa: UIImageView!
    @IBOutlet weak var musica: UILabel!
    @IBOutlet weak var album: UILabel!
    @IBOutlet weak var cantor: UILabel!
    
    override func viewDidLoad() {
        super.viewDidLoad()

        self .capa.image = UIImage(named: self.nomeImagem)
        self.musica.text = self.nomeMusica
        self.album.text = self.nomeAlbum
        self.cantor.text = self.nomeCantor
    }
    

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destination.
        // Pass the selected object to the new view controller.
    }
    */

}
