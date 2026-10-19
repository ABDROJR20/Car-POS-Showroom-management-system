<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ShowroomSetting;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function getSettings()
    {
        $all = ShowroomSetting::all()->pluck('value', 'key')->toArray();

        $defaults = [
            'showroomName' => 'Ahsan Autos',
            'tagline' => 'Specialized Used Car Showroom & POS Management',
            'phone' => '+92 300 1234567',
            'whatsapp' => '+92 313 2066883',
            'email' => 'contact@ahsanautos.pk',
            'ntn' => 'NTN-7861122-9',
            'strn' => 'STRN-09-12-3456-789',
            'address' => 'Main IJP Road, Near Faizabad Interchange, Islamabad / Rawalpindi, Pakistan',
            'currency' => 'PKR',
            'currencySymbol' => '₨',
            'taxRatePct' => '0',
            'defaultTransferFee' => '25000',
            'defaultBrokerFeePct' => '1.0',
            'defaultAgentCommission' => '15000',
            'termsAndConditions' => "1. Vehicle is sold on 'as is, where is' basis.\n2. All documents, biometric verifications and original file transfers are the responsibility of the purchaser.\n3. Token advance is non-refundable upon deal cancellation.",
            'receiptFooter' => "Powered By Rojrztech\n03132066883 / 03151210736\nwebsite: Rojrztech.com",
            'enableWhatsAppSharing' => 'true',
            'enableAutoMatcher' => 'true',
        ];

        $merged = array_merge($defaults, $all);

        return response()->json([
            'status' => 'success',
            'data' => $merged,
        ]);
    }

    public function updateSettings(Request $request)
    {
        $data = $request->all();

        foreach ($data as $key => $val) {
            ShowroomSetting::setSetting($key, $val, is_bool($val) ? 'boolean' : 'string');
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Showroom configuration and print branding saved successfully.',
        ]);
    }
}
