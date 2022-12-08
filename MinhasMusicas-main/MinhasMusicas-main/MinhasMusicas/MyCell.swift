//
//  MyCell.swift
//  MinhasMusicas
//
//  Created by COTEMIG on 18/08/22.
//

import UIKit

class MyCell: UITableViewCell {
    
    @IBOutlet weak var capa: UIImageView!
    @IBOutlet weak var musica: UILabel!
    @IBOutlet weak var album: UILabel!
    @IBOutlet weak var cantor: UILabel!
    
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }

}
