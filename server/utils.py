import torch
import torch.nn as nn
import torchvision.transforms as transforms
from PIL import Image
import os

# If you're using Ultralytics YOLOv8 or later
from ultralytics import YOLO

# Unified class labels
CLASS_LABELS = [
    "rice leaf roller", "rice leaf caterpillar", "paddy stem maggot", "asiatic rice borer", 
    "yellow rice borer", "rice gall midge", "Rice Stemfly", "brown plant hopper", 
    "white backed plant hopper", "small brown plant hopper", "rice water weevil", 
    "rice leafhopper", "grain spreader thrips", "rice shell pest", "grub", "mole cricket", 
    "wireworm", "white margined moth", "black cutworm", "large cutworm", "yellow cutworm", 
    "red spider", "corn borer", "army worm", "aphids", "Potosiabre vitarsis", "peach borer", 
    "english grain aphid", "green bug", "bird cherry-oataphid", "wheat blossom midge", 
    "penthaleus major", "longlegged spider mite", "wheat phloeothrips", "wheat sawfly", 
    "cerodonta denticornis", "beet fly", "flea beetle", "cabbage army worm", "beet army worm", 
    "Beet spot flies", "meadow moth", "beet weevil", "sericaorient alismots chulsky", 
    "alfalfa weevil", "flax budworm", "alfalfa plant bug", "tarnished plant bug", "Locustoidea", 
    "lytta polita", "legume blister beetle", "blister beetle", "therioaphis maculata Buckton", 
    "odontothrips loti", "Thrips", "alfalfa seed chalcid", "Pieris canidia", "Apolygus lucorum", 
    "Limacodidae", "Viteus vitifoliae", "Colomerus vitis", "Brevipoalpus lewisi McGregor", 
    "oides decempunctata", "Polyphagotars onemus latus", "Pseudococcus comstocki Kuwana", 
    "parathrene regalis", "Ampelophaga", "Lycorma delicatula", "Xylotrechus", "Cicadella viridis", 
    "Miridae", "Trialeurodes vaporariorum", "Erythroneura apicalis", "Papilio xuthus", 
    "Panonchus citri McGregor", "Phyllocoptes oleiverus ashmead", "Icerya purchasi Maskell", 
    "Unaspis yanonensis", "Ceroplastes rubens", "Chrysomphalus aonidum", "Parlatoria zizyphus Lucus", 
    "Nipaecoccus vastalor", "Aleurocanthus spiniferus", "Tetradacus c Bactrocera minax", 
    "Dacus dorsalis(Hendel)", "Bactrocera tsuneonis", "Prodenia litura", "Adristyrannus", 
    "Phyllocnistis citrella Stainton", "Toxoptera citricidus", "Toxoptera aurantii", 
    "Aphis citricola Vander Goot", "Scirtothrips dorsalis Hood", "Dasineura sp", 
    "Lawana imitata Melichar", "Salurnis marginella Guerr", "Deporaus marginatus Pascoe", 
    "Chlumetia transversa", "Mango flat beak leafhopper", "Rhytidodera bowrinii white", 
    "Sternochetus frigidus", "Cicadellidae"
]

def load_model(model_path, model_type='resnet'):
    """
    Load a model. Supports 'resnet' and 'yolo' types.
    """
    if model_type == 'resnet':
        model = torch.hub.load('pytorch/vision:v0.10.0', 'resnet50', pretrained=False)
        model.fc = nn.Linear(model.fc.in_features, len(CLASS_LABELS))
        if os.path.exists(model_path):
            model.load_state_dict(torch.load(model_path, map_location=torch.device('cpu')))
            model.eval()
        else:
            raise FileNotFoundError(f"Model file not found at {model_path}")
        return model

    elif model_type == 'yolo':
        if os.path.exists(model_path):
            model = YOLO(model_path)  # ✅ Safer and correct way
            return model
        else:
            raise FileNotFoundError(f"YOLO model file not found at {model_path}")
    
    else:
        raise ValueError(f"Unsupported model type: {model_type}. Use 'resnet' or 'yolo'.")

def preprocess_image(image, model_type='resnet'):
    if model_type == 'resnet':
        transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], 
                                 [0.229, 0.224, 0.225])
        ])
        return transform(image).unsqueeze(0)
    elif model_type == 'yolo':
        return image  # YOLO handles preprocessing internally
    else:
        raise ValueError(f"Unsupported model type: {model_type}")

def predict(model, input_tensor, model_type='resnet'):
    if model_type == 'resnet':
        model.eval()
        with torch.no_grad():
            outputs = model(input_tensor)
            _, predicted = torch.max(outputs, 1)
            confidence = torch.nn.functional.softmax(outputs, dim=1)[0][predicted.item()].item()
            return predicted.item(), confidence

    elif model_type == 'yolo':
        results = model(input_tensor)  # input_tensor should be a PIL image or path
        predictions = results[0].boxes.cls.cpu().numpy()
        names = results[0].names
        if len(predictions) == 0:
            return "No pest detected"
        else:
            return [names[int(cls)] for cls in predictions]
    else:
        raise ValueError(f"Unsupported model type: {model_type}")

def get_label_name(index):
    return CLASS_LABELS[index]
