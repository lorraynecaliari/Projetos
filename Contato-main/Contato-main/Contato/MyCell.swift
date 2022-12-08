//
//  MyCell.swift
//  Contato
//
//  Created by COTEMIG on 11/08/22.
//

import UIKit

class MyCell: UITableViewCell {

    @IBOutlet weak var nome: UILabel!
    @IBOutlet weak var email: UILabel!
    @IBOutlet weak var endereco: UILabel!
    @IBOutlet weak var telefone: UILabel!
    
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }

}
